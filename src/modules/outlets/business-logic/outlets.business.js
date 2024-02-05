import { ObjectId } from "mongodb";
import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import assert from "assert";
import jwt from "jsonwebtoken";
import outletModel from "../outlets.repo.js";
import userBusiness from "../../users/business-logic/users.business.js";
import { roleService } from "../../roles/roles.controller.js";
import { getSecret } from "../../../../configuration.js";

const outletBusiness = {};

outletBusiness.getOutlet = async (id) => await outletModel.findById(id);

outletBusiness.addOutletFinalPayload = async ({ payload, loggedInUser }) => {
  if(payload.outlet_owner) {
    const owner = await userBusiness.getUser(payload.outlet_owner);
    assert(owner, createError(
      StatusCodes.NOT_FOUND,
      'Owner not found' 
    ));
    assert(['1706209692929', '1706338422324'].includes(owner.role_id), createError(
      StatusCodes.BAD_REQUEST,
      'Outlet owner id is not valid'
    ));
  }

  if(payload.outlet_manager) {
    const manager = await userBusiness.getUser(payload.outlet_manager);
    assert(manager, createError(
      StatusCodes.NOT_FOUND,
      'Outlet manager not found' 
    ));
    assert(['1706209692929', '1706338422324', '1706338446567'].includes(manager.role_id), createError(
      StatusCodes.BAD_REQUEST,
      'Outlet manager id is not valid'
    ));
  }

  return {
    outlet_owner: payload.outlet_owner ? payload.outlet_owner : null,
    outlet_manager: payload.outlet_manager ? payload.outlet_manager : null,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    postal_code: payload.postal_code,
    opening_date: payload.opening_date ? payload.opening_date : "",
    license: payload.license ? payload.license : "",
    created_by: loggedInUser.username,
    is_active: true
  };
};

outletBusiness.getSearchFilterObj = async (search) => {
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

outletBusiness.validateOutletId = async ({ id, loggedInUser}) => {
  assert(ObjectId.isValid(id), createError(
    StatusCodes.BAD_REQUEST,
    'Invalid outlet id'
  ));
  const outlet = await outletModel.findOne({ _id: new ObjectId(id) }, { __v: 0 });
  assert(outlet, createError(
    StatusCodes.NOT_FOUND,
    'Outlet not found'
  ));

  assert(loggedInUser.role_id === '1706209692929' || (loggedInUser.outlet_ids.includes(id)), createError(
    StatusCodes.UNAUTHORIZED,
    'Access denied for given outlet id'
  ));
  return outlet;
};

outletBusiness.validateUpdateOutletPayload = async (payload) => {
  if(payload.outlet_owner) {
    const owner = await userBusiness.getUser(payload.outlet_owner);
    assert(owner, createError(
      StatusCodes.NOT_FOUND,
      'Owner not found' 
    ));
    assert(['1706209692929', '1706338422324'].includes(owner.role_id), createError(
      StatusCodes.BAD_REQUEST,
      'Outlet owner id is not valid'
    ));
  }

  if(payload.outlet_manager) {
    const manager = await userBusiness.getUser(payload.outlet_manager);
    assert(manager, createError(
      StatusCodes.NOT_FOUND,
      'Outlet manager not found' 
    ));
    assert(['1706209692929', '1706338422324', '1706338446567'].includes(manager.role_id), createError(
      StatusCodes.BAD_REQUEST,
      'Outlet manager id is not valid'
    ));
  }
};

outletBusiness.updateOutletFinalPayload = (loggedInUser, payload, outlet) => {
  let finalPayload = {
    outlet_owner: payload.outlet_owner ? payload.outlet_owner : outlet.outlet_owner,
    outlet_manager: payload.outlet_manager ? payload.outlet_manager : outlet.outlet_manager,
    address: payload.address ? payload.address : outlet.address,
    city: payload.city ? payload.city : outlet.city,
    state: payload.state ? payload.state : outlet.state,
    postal_code: payload.postal_code ? payload.postal_code : outlet.postal_code,
    opening_date: payload.opening_date ? payload.opening_date : outlet.opening_date,
    license: payload.license ? payload.license : outlet.license,
    updated_by: loggedInUser.username,
    is_active: true
  };
  return finalPayload;
};

export default outletBusiness;