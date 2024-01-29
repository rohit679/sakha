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
  },
  role_rank: {
    type: String,
    validate: {
      validator: (v) => v > 0,
      message: props => `${props.value} is not a role rank`
    },
    default: "100"
  }
}, { strict: false, timestamps: true });

export default mongoose.model('roles', roleSchema);