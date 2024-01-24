import { Router } from "express";
import { roleRouter } from "./roles.handler.js";

const router = Router();
router.use('/roles', roleRouter);

const roleModule = {
  init: (app) => {
    app.use(router);
    console.log("Role module loaded ✅`");
  }
};

export default roleModule;