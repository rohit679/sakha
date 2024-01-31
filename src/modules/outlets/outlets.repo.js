import mongoose, { Schema } from "mongoose";

const outletSchema = new mongoose.Schema({
  outlet_owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, 'Outlet owner is required']
  },
  outlet_manager: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, 'Outlet manager is required']
  },
  address: {
    type: String,
    lowercase: true,
    trim: true
  },
  city: {
    type: String,
    lowercase: true,
    trim: true
  },
  state: {
    type: String,
    lowercase: true,
    trim: true
  },
  postal_code: {
    type: String,
    lowercase: true,
    trim: true
  },
  opening_date: {
    type: String,
  },
  license: {
    type: String,
    trim: true
  },
  created_by: {
   type: String,
  },
  updated_by: {
    type: String,
  }
}, { strict: false, timestamps: true });

export default mongoose.model('outlets', outletSchema);