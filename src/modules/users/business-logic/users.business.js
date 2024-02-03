import { ObjectId } from "mongodb";
import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import assert from "assert";
import jwt from "jsonwebtoken";
import userModel from "../users.repo.js";
import { roleService } from "../../roles/roles.controller.js";
import outletBusiness from "../../outlets/business-logic/outlets.business.js";
import { getSecret } from "../../../../configuration.js";

const userBusiness = {};

userBusiness.addUserFinalPayload = async (payload) => {
  const role = await roleService.getRoleByRoleId(payload.role_id);
  assert(role, createError(
    StatusCodes.NOT_FOUND,
    'role id not found',
  ));
  assert(role.role_name !== "admin", createError(
    StatusCodes.BAD_REQUEST,
    'Cannot create admin role'
  ));

  if(payload.outlet_ids) {
    assert(!(role.role_id !== '1706338422324' && payload.outlet_ids.length > 0), createError(
      StatusCodes.BAD_REQUEST,
      'Provided role id can not have multiple outlet ids'
    ));

    payload.outlet_ids.forEach(async (outlet_id) => {
      assert(ObjectId.isValid(outlet_id), createError(
        StatusCodes.BAD_REQUEST,
        'Invalid outlet id'
      ));
      let outlet = await outletBusiness.getOutlet(outlet_id);
      assert(outlet, createError(
        StatusCodes.NOT_FOUND,
        'Outlet id is not found'
      ))
    });
  }

  if(payload.designation) {
    assert(['1706338422324', '1706338446567'].includes(payload.designation) && payload.designation === role.role_name, createError(
      StatusCodes.BAD_REQUEST,
      'Invalid designation for provided role id'
    ));
  }

  return {
    first_name: payload.first_name,
    last_name: payload.last_name ? payload.last_name : "",
    phone: payload.phone,
    phone_extension: payload.phone_extension ? payload.phone_extension : "+91",
    email: payload.email ? payload.email : "",
    address: payload.address ? payload.address : "",
    document_type: payload.document_type ? payload.document_type : "",
    document_proof: payload.document_proof ? payload.document_proof : "",
    profile_pic: payload.profile_pic ? payload.profile_pic : "",
    role_id: payload.role_id,
    role_name: role.role_name,
    role_rank: role.role_rank,
    designation: payload.designation ? payload.designation : "",
    outlet_ids: payload.outlet_ids ? payload.outlet_ids : [],
    salary: payload.salary ? payload.salary : 0,
    username: payload.username,
    password: payload.password,
    created_by: "",
    is_active: true
  };
};

userBusiness.loginUserValidation = async ({ email, username, password }) => {
  if(!username && !email) {
    throw createError(
      StatusCodes.BAD_REQUEST,
      "username or email is required"
    );
  }

  const user = await userModel.findOne({
    $or: [{ username }, { email }]
  });
  if(!user) {
    throw createError(
      StatusCodes.NOT_FOUND,
      "User doesn't exist"
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "Invalid user credentials"
    );
  }
  return user;
};

userBusiness.refreshAccessToken = async ({ body, cookies }) => {
  const incomingRefreshToken = cookies.refreshToken || body.refresh_token;
  if(!incomingRefreshToken) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized request"
    );
  }

  const secret = getSecret();
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    secret.refreshTokenSecret
  );

  const user = await userModel.findById(decodedToken?.id, {
    __v: 0, password: 0
  });
  if(!user) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "Invalid refresh token"
    );
  }
  
  if(incomingRefreshToken !== user?.refresh_token) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "Refresh token is expired or used"
    );
  }
  delete user.refresh_token;
  return user;
};

userBusiness.getSearchFilterObj = async (search) => {
  let searchFilterObj = {};

  if(search !== "") {
    let regex = new RegExp(search, 'i');
    searchFilterObj = {
      $or: [
        { first_name: regex },
        { last_name: regex },
        { email: regex },
        { phone: regex },
        { address: regex }      
      ]
    };
  };
  return searchFilterObj;
};

userBusiness.validateUserId = async ({ id, loggedInUser}) => {
  assert(ObjectId.isValid(id), createError(
    StatusCodes.BAD_REQUEST,
    'Invalid user id'
  ));
  const user = await userModel.findOne({ _id: new ObjectId(id) }, { __v: 0, password: 0, refresh_token: 0 });
  assert(user, createError(
    StatusCodes.NOT_FOUND,
    'User not found'
  ));

  assert(Number(user.role_rank) > Number(loggedInUser.user_rank) || user._id.toString() === loggedInUser.id.toString(), createError(
    StatusCodes.UNAUTHORIZED,
    'Access denied'
  ));
  return user;
};

userBusiness.getUser = async (id) => await userModel.findById(id);

userBusiness.validateUpdateUserPayload = (payload) => {
  if(payload.phone) {
    assert(
      /\d{10}/.test(payload.phone) && payload.phone.length <= 10, 
      createError(StatusCodes.BAD_REQUEST, 'Invalid phone number')
    );
  }
  if(payload.email) {
    assert(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload.email),
      createError(StatusCodes.BAD_REQUEST, 'Invalid email')
    );
  }
  if(payload.document_type) {
    assert(
      ["adhar card", "pan card", "driving license", "voter id", "passport", "bank passbook"].includes(payload.document_type),
      createError(StatusCodes.BAD_REQUEST, 'Invalid document type')
    );
  }
  if(payload.designation) {
    assert(
      ["subadmin", "outlet manager", "waiter", "cook", "watch man", "helper", "receptionist", "cleaner"].includes(payload.designation),
      createError(StatusCodes.BAD_REQUEST, 'Invalid designation')
    );
  }
};

userBusiness.updateUserFinalPayload = (loggedInUser, payload, user) => {
  let updatedRoleInfo = {
    role_id: user.role_id,
    role_name: user.role_name,
    role_rank: user.role_rank
  };
  if(payload.role_id) {
    const role = roleService.getRoleByRoleId(payload.role_id);
    assert(role, createError(
      StatusCodes.NOT_FOUND,
      'role id not found'
    ));
    assert(role.role_name === "admin", createError(
      StatusCodes.BAD_REQUEST,
      'Cannot create admin role'
    ));
    updatedRoleInfo = { role_id: payload.role_id, role_name: role.role_name, role_rank: role.role_rank };
  }

  if(payload.designation) {
    assert(['1706338422324', '1706338446567'].includes(payload.designation) && payload.designation === updatedRoleInfo.role_name, createError(
      StatusCodes.BAD_REQUEST,
      'Invalid designation for provided role id'
    ));
  }

  let finalPayload = {
    ...updatedRoleInfo,
    first_name: payload.first_name ? payload.first_name : user.first_name,
    last_name: payload.last_name ? payload.last_name : user.last_name,
    phone: payload.phone ? payload.phone : user.phone,
    phone_extension: payload.phone_extension ? payload.phone_extension : user.phone_extension,
    email: payload.email ? payload.email : user.email,
    address: payload.address ? payload.address : user.address,
    document_proof: payload.document_proof ? payload.document_proof : user.document_proof,
    document_type: payload.document_type ? payload.document_type : user.document_type,
    profile_pic: payload.profile_pic ? payload.profile_pic : user.profile_pic,
    designation: payload.designation ? payload.designation : user.designation,
    salary: payload.salary ? payload.salary : user.salary,
    is_active: payload.is_active !== null ? payload.is_active : user.is_active,
    last_updated_by: loggedInUser.username
  };

  if(payload.outlet_ids) {
    assert(!(updatedRoleInfo.role_id !== '1706338422324' && payload.outlet_ids.length > 0), createError(
      StatusCodes.BAD_REQUEST,
      'Provided role id can not have multiple outlet ids'
    ));

    payload.outlet_ids.forEach(async (outlet_id) => {
      assert(ObjectId.isValid(outlet_id), createError(
        StatusCodes.BAD_REQUEST,
        'Invalid outlet id'
      ));
      let outlet = await outletBusiness.getOutlet(outlet_id);
      assert(outlet, createError(
        StatusCodes.NOT_FOUND,
        'Outlet id is not found'
      ))
    });
    
    finalPayload = { ...finalPayload, outlet_ids: payload.outlet_ids };
  }

  return finalPayload;
};

userBusiness.generateAccessAndRefereshTokens = async(userId) =>{
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refresh_token = refreshToken
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken }
  } catch (err) {
    throw createError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while generating referesh and access token"
    ); 
  }
}

export default userBusiness;