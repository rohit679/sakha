import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: [true, 'role name is required'],
    unique: [true, 'role name must be unique'],
    trim: true,
    lowercase: true
  },
  route_permission: {
    type: Array,
  }
}, { strict: false, timestamps: true });

export default mongoose.model('roles', roleSchema);