import { ObjectId } from 'mongodb';
import assert from "assert";
import createError from 'http-errors-lite';
import { StatusCodes } from 'http-status-codes';
import roleModel from '../roles.repo.js';

const roleBusiness = {};

roleBusiness.addRoleFinalPayload = (payload) => {
  return {
    role_id: Date.now().toString(),
    role_name: payload.role_name,
    route_permission: payload.route_permission ? payload.route_permission : [],
    created_by: "",
    is_active: true
  };
};

roleBusiness.validateRoleId = async (id) => {
  assert(ObjectId.isValid(id), createError(
    StatusCodes.BAD_REQUEST,
    'Invalid Role id'
  ));

  const role = await roleModel.findOne({ _id: new ObjectId(id) }, { __v: 0 } );
  assert(role, createError(
    StatusCodes.NOT_FOUND,
    'Role not found'
  ));
};

roleBusiness.updateRoleFinalPayload = (payload, role) => {
  return {
    route_permission: payload.route_permission ? payload.route_permission : role.route_permission,
    is_active: payload.is_active !== null ? payload.is_active : role.is_active,
    last_updated_by: ""
  };
};

export default roleBusiness;