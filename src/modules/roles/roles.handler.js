import { Router } from "express";
import { httpHandler } from "../../utils/http-handler.js";
import { roleService } from "./roles.controller.js";

const roleRouter = Router();

roleRouter.post(
  '/add',
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