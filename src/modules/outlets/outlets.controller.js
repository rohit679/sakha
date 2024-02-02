import createError from 'http-errors-lite';
import outletModel from './outlets.repo.js';
import outletBusiness from './business-logic/outlets.business.js';
import { StatusCodes } from 'http-status-codes';
import assert from 'assert';

const outletService = {};

outletService.addOutlet = async ({ payload, loggedInUser }) => {
  const finalPayload = await outletBusiness.addOutletFinalPayload({ payload, loggedInUser });
  const outlet = await outletModel.create(finalPayload);
  const createdOutlet = await outletModel.findById(outlet._id, { __v: 0 });
  
  if(!createdOutlet) {
    throw createError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while adding the outlet"
    );
  }
  return createdOutlet;
};

outletService.getOutletById = async ({ id, loggedInUser }) => {
  const outlet = await outletBusiness.validateOutletId({ id, loggedInUser });
  return outlet;
};

outletService.getFilteredOutlets = async ({ query, search, page_number, page_size, sort, loggedInUser }) => {
  // const roleBasedFilter = { role_rank: { $gt: loggedInUser.role_rank } };
  // const searchFilterObj = await outletBusiness.getSearchFilterObj(search);
  // let skip = (page_number - 1) * page_size;
  // const outlets = await outletModel.find(
  //   { ...query, ...searchFilterObj, ...roleBasedFilter }, 
  //   { __v: 0, password: 0, refresh_token: 0 }).skip(skip).limit(page_size).sort(sort);
  // return outlets;
};

outletService.updateOutlet = async ({ loggedInUser, id, payload }) => {
  const outlet = await outletBusiness.validateOutletId({ id, loggedInUser });
  outletBusiness.validateUpdateOutletPayload(payload);
  
  const finalPayload = outletBusiness.updateOutletFinalPayload(loggedInUser, payload, outlet);
  await outletModel.findOneAndUpdate({ _id: id }, finalPayload);
  
  const updatedOutlet = await outletModel.findById(id, { __v: 0 });
  return updatedOutlet;
};

outletService.deleteOutlet = async (id) => {
  await outletModel.deleteOne(id);
};

export { outletService };