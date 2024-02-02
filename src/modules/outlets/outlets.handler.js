import { Router } from "express";
import { httpHandler } from "../../utils/http-handler.js";
import { outletService } from "./outlets.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/checkRole.middleware.js";

const outletRouter = Router();

outletRouter.post(
  '/add',
  verifyJWT,
  checkRole(['1706209692929']),  
  httpHandler(async (req, res) => {
    const payload = req.body;
    const outlet = await outletService.addOutlet({ payload, loggedInUser: req.user });
    res.send({
      error: false,
      data: outlet,
      message: "Outlet added successfully",
      token: ""
    });
  })
);

outletRouter.get(
  '/id/:id',
  verifyJWT,
  checkRole(['1706209692929', '1706338422324', '1706338446567']),
  httpHandler(async (req, res) => {
    const { id } = req.params;
    const outlet = await outletService.getOutletById({ id, loggedInUser: req.user });
    res.send({
      error: false,
      data: outlet,
      message: "Outlet retrieved",
      token: ""
    });
  })
);

outletRouter.post(
  '/',
  verifyJWT,
  checkRole(['1706209692929', '1706338422324']),
  httpHandler(async (req, res) => {
    const payload = req.body;
    const outlets = await outletService.getFilteredOutlets({ ...payload, loggedInUser: req.user });
    res.send({
      error: false,
      data: outlets,
      total_data: outlets.length,
      page_number: payload.page_number,
      page_size: payload.page_size,
      message: "Outlets retrieved",
      token: ""
    });
  })
);

outletRouter.patch(
  '/id/:id',
  verifyJWT,
  checkRole(['1706209692929', '1706338422324']),
  httpHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const outlet = await outletService.updateOutlet({ loggedInUser:req.user, id, payload });
    res.send({
      error: false,
      data: outlet,
      message: "Outlet updated",
      token: ""
    });
  })
);

outletRouter.delete(
  '/id/:id',
  verifyJWT,
  checkRole(['1706209692929']),
  httpHandler(async (req, res) => {
    const { id } = req.params;
    await outletService.deleteOutlet(id);
    res.send({
      error: false,
      data: [],
      message: "Provided outlet id deleted",
      token: ""
    });
  })
);

export { outletRouter };