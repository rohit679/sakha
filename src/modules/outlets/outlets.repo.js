import mongoose, { Schema } from "mongoose";

const outletSchema = new mongoose.Schema({
  outlet_owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  outlet_manager: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  address: {
    type: String,
    required: [true, 'address is required'],
    lowercase: true,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'city is required'],
    lowercase: true,
    trim: true
  },
  state: {
    type: String,
    required: [true, 'state is required'],
    lowercase: true,
    trim: true
  },
  postal_code: {
    type: String,
    required: [true, 'postal code is required'],
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
}, { strict: false, timestamps: true });

export default mongoose.model('outlets', outletSchema);