import roleModel from './roles.repo.js';
import roleBusiness from './business-logic/roles.business.js';

const roleService = {};

roleService.addRole = async (payload) => {
  const finalPayload = roleBusiness.addRoleFinalPayload(payload);
  const role = await roleModel.create(finalPayload);
  return role;
};

roleService.getRoleById = async (id) => {
  const role = await roleBusiness.validateRoleId(id);
  return role;
};

roleService.getRoleByRoleId = async (id) => {
  const role = await roleModel.findOne({ role_id: id }, { __v: 0 });
  return role;
};

roleService.getAllRoles = async () => {
  const roles = await roleModel.find({}, { __v: 0 });
  return roles;
};

roleService.updateRole = async ({ id, payload }) => {
  const role = await roleBusiness.validateRoleId(id);
  const finalPayload = roleBusiness.updateRoleFinalPayload(payload, role);
  await roleModel.findOneAndUpdate({ _id: id }, finalPayload);

  const updatedRole = await roleModel.findById(id, { __v: 0 });
  return updatedRole;
};

roleService.deleteRoles = async (ids) => {
  const finalIds = ids.map((id) => id != "admin role id");
  await roleModel.deleteMany({ _id: { $in: finalIds } });
}

export { roleService };