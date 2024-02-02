import { Router } from "express";
import { outletRouter } from "./outlets.handler.js";

const router = Router();

router.use('/outlets', outletRouter);

const outletModule = {
  init: (app) => {
    app.use(router);
    console.log("Outlet module loaded ✅");
  }
};

export default outletModule;