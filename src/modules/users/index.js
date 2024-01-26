import { Router } from "express";
import { userRouter } from "./users.handler.js";

const router = Router();
router.use('/users', userRouter);

const userModule = {
  init: (app) => {
    app.use(router);
    console.log("User module loaded ✅");
  }
};

export default userModule;