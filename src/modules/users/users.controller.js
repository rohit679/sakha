import createError from 'http-errors-lite';
import userModel from './users.repo.js';
import userBusiness from './business-logic/users.business.js';
import { StatusCodes } from 'http-status-codes';
import assert from 'assert';

const userService = {};

userService.registerUser = async (payload) => {
  const finalPayload = await userBusiness.addUserFinalPayload(payload);
  const user = await userModel.create(finalPayload);
  const createdUser = await userModel.findById(user._id, { password: 0, refresh_token: 0, __v: 0 });
  
  if(!createdUser) {
    throw createError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while registering the user"
    );
  }
  return createdUser;
};

userService.loginUser = async ({ email, username, password }) => {
  const user = await userBusiness.loginUserValidation({ email, username, password });
  const { accessToken, refreshToken } = await userBusiness.generateAccessAndRefereshTokens(user.id);
  const loggedInUser = await userModel.findById(user.id, { password: 0, refresh_token: 0, __v: 0 });
  return { data: loggedInUser, accessToken, refreshToken };
};

userService.logoutUser = async(id) => {
  await userModel.findByIdAndUpdate(
    id,
    { $unset: { refresh_token: 1 } },
    { new: true }
  );
};

userService.refreshAccessToken = async ({ body, cookies }) => {
  const loggedInUser = await userBusiness.refreshAccessToken({ body, cookies });
  const { accessToken, newRefreshToken } = await userBusiness.generateAccessAndRefereshTokens(loggedInUser._id);
  return { accessToken, newRefreshToken };
};

userService.changeCurrentPassword = async({ id, old_password, new_password }) => {
  const user = await userModel.findById(id);
  const isPasswordCorrect = await user.isPasswordCorrect(old_password);

  assert(isPasswordCorrect, createError(
    StatusCodes.BAD_REQUEST,
    "Invalid old password"
  ));
  
  assert(old_password != new_password, createError(
    StatusCodes.BAD_REQUEST,
    "Old & new password can't be same"
  ));

  user.password = new_password;
  await user.save({ validateBeforeSave: false });
};

userService.getUserById = async ({ id, loggedInUser }) => {
  const user = await userBusiness.validateUserId({ id, loggedInUser });
  return user;
};

userService.getFilteredUsers = async ({ query, search, page_number, page_size, sort, loggedInUser }) => {
  const roleBasedFilter = { role_rank: { $gt: loggedInUser.role_rank } };
  const searchFilterObj = await userBusiness.getSearchFilterObj(search);
  let skip = (page_number - 1) * page_size;
  const users = await userModel.find(
    { ...query, ...searchFilterObj, ...roleBasedFilter }, 
    { __v: 0, password: 0, refresh_token: 0 }).skip(skip).limit(page_size).sort(sort);
  return users;
};

userService.updateUser = async ({ loggedInUser, id, payload }) => {
  const user = await userBusiness.validateUserId({ id, loggedInUser });
  userBusiness.validateUpdateUserPayload(payload);
  
  const finalPayload = userBusiness.updateUserFinalPayload(loggedInUser, payload, user);
  await userModel.findOneAndUpdate({ _id: id }, finalPayload);
  
  const updatedUser = await userModel.findById(id, { __v: 0, password: 0, refresh_token: 0 });
  return updatedUser;
};

userService.deleteUsers = async ({ id, loggedInUser }) => {
  await userBusiness.validateUserId({ id, loggedInUser });
  await userModel.deleteOne(id);
};

export { userService };