import { Router } from "express";
import { httpHandler } from "../../utils/http-handler.js";
import { roleService } from "./roles.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/checkRole.middleware.js";

const roleRouter = Router();

roleRouter.post(
  '/add',
  verifyJWT,
  checkRole(['1706209692929']),
  httpHandler(async (req, res) => {
    const body = req.body;
    const role = await roleService.addRole(body);
    res.send({
      error: false,
      data: role,
      message: "Role added",
      token: ""
    });
  })
);

roleRouter.get(
  '/id/:id',
  verifyJWT,
  checkRole(['1706209692929']),
  httpHandler(async (req, res) => {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    res.send({
      error: false,
      data: role,
      message: "Role retrieved",
      token: ""
    });
  })
);

roleRouter.get(
  '/',
  verifyJWT,
  checkRole(['1706209692929']),
  httpHandler(async (req, res) => {
    const roles = await roleService.getAllRoles();
    res.send({
      error: false,
      data: roles,
      message: "Roles retrieved",
      token: ""
    });
  })
);

roleRouter.patch(
  '/id/:id',
  verifyJWT,
  checkRole(['1706209692929']),
  httpHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const role = await roleService.updateRole({ id, payload });
    res.send({
      error: false,
      data: role,
      message: "Role  updated",
      token: ""
    });
  })
);

roleRouter.delete(
  '/delete',
  verifyJWT,
  checkRole(['1706209692929']),
  httpHandler(async (req, res) => {
    const { ids } = req.body;
    await roleService.deleteRoles(ids);
    res.send({
      error: false,
      data: [],
      message: "Provided role ids deleted",
      token: ""
    });
  })
);

export { roleRouter };