import { Router } from "express";
import { httpHandler } from "../../utils/http-handler.js";
import { userService } from "./users.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post(
  '/sign-up',
  httpHandler(async (req, res) => {
    const body = req.body;
    const user = await userService.registerUser(body);
    res.send({
      error: false,
      data: user,
      message: "User Signed up successfully",
      token: ""
    });
  })
);

userRouter.post(
  '/sign-in',
  httpHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const data = await userService.loginUser({ email, username, password });
    
    const options = {
      httpOnly: true,
      secure: true
    };

    res
    .status(200)
    .cookie("accessToken", data.accessToken, options)
    .cookie("refreshToken", data.refreshToken, options)
    .send({
      error: false,
      data: data.data,
      message: "User Signed in successfully",
      token: data.accessToken
    });
  })
);

userRouter.post(
  '/sign-out',
  verifyJWT,
  httpHandler(async (req, res) => {
    await userService.logoutUser(req.user.id);
    const options = {
      httpOnly: true,
      secure: true
    };

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send({
      error: false,
      data: [],
      message: "User Signed out successfully",
    });
  })
);

userRouter.post(
  '/refresh-token',
  verifyJWT,
  httpHandler(async (req, res) => {
    const { body, cookies } = req;
    const token = await userService.refreshAccessToken({ body, cookies });
    const options = {
      httpOnly: true,
      secure: true
    };

    res
    .status(200)
    .cookie("accessToken", token.accessToken, options)
    .cookie("refreshToken", token.newRefreshToken, options)
    .send({
      error: false,
      data: [],
      message: "Acsess token refreshed",
    });
  })
);

userRouter.post(
  '/change-password',
  verifyJWT,
  httpHandler(async (req, res) => {
    const { old_password, new_password } = req.body;
    await userService.changeCurrentPassword({ id: req.user.id, old_password, new_password });

    res.send({
      error: false,
      data: [],
      message: "Password changed successfully",
    });
  })
);

userRouter.get(
  '/current-user',
  verifyJWT,
  httpHandler(async (req, res) => {
    res.send({
      error: false,
      data: req.user,
      message: "User fetched successfully",
    });
  })
);

userRouter.get(
  '/id/:id',
  verifyJWT,
  httpHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById({ id, loggedInUser: req.user });
    res.send({
      error: false,
      data: user,
      message: "User retrieved",
      token: ""
    });
  })
);

userRouter.post(
  '/',
  verifyJWT,
  httpHandler(async (req, res) => {
    const payload = req.body;
    const users = await userService.getFilteredUsers({ ...payload, loggedInUser: req.user });
    res.send({
      error: false,
      data: users,
      total_data: users.length,
      page_number: payload.page_number,
      page_size: payload.page_size,
      message: "Users retrieved",
      token: ""
    });
  })
);

userRouter.patch(
  '/id/:id',
  verifyJWT,
  httpHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const user = await userService.updateUser({ loggedInUser:req.user, id, payload });
    res.send({
      error: false,
      data: user,
      message: "User updated",
      token: ""
    });
  })
);

userRouter.delete(
  '/id/:id',
  verifyJWT,
  httpHandler(async (req, res) => {
    const { id } = req.params;
    await userService.deleteUsers({ id, loggedInUser: req.user });
    res.send({
      error: false,
      data: [],
      message: "Provided user id deleted",
      token: ""
    });
  })
);

export { userRouter };