import createError from "http-errors-lite";
import userModel from "../modules/users/users.repo.js";
import { StatusCodes } from "http-status-codes";
import { httpHandler } from "../utils/http-handler.js";

export const checkRole = (roles) => httpHandler(async (req, res, next) => {
  let { id } = req.user;
  const user = await userModel.findById(id);
  if(!roles.includes(user.role_id)) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      'Access denied'
    );
  }
  next();
});