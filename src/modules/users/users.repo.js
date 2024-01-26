import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getSecret } from "../../../configuration.js";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    lowercase: true,
    trim: true
  },
  last_name: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => /\d{10}/.test(v) && v.length <= 10,
      message: props =>  `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone required'],
    trim: true
  },
  phone_extension: {
    type: String,
    default: '+91',
    trim: true
  },
  email: {
    type: String,
    validate: {
      validator: (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
      message: props => `${props.value} is not a valid email`
    },
    unique: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    lowercase: true,
    trim: true
  },
  document_proof: {
    type: String,
    lowercase: true,
    trim: true
  },
  document_type: {
    type: String,
    enum: ["adhar card", "pan card", "driving license", "voter id", "passport", "bank passbook"],
    required: function () {
      return this.document_proof;
    }
  },
  profile_pic: {
    type: String,
    trim: true
  },
  role_id: {
    type: String,
    required: [true, 'role id is required'],
    trim: true
  },
  designation: {
    type: String,
    enum: ["subadmin", "outlet manager", "waiter", "cook", "watch man", "helper", "receptionist", "cleaner"]
  },
  salary: {
    type: Number,
    validate: {
      validator: (v) => v >= 0,
      message: props => `${props.value} is not a valid salary`
    }
  },
  username: {
    type: String,
    unique: [true, 'username must be unique'],
    required: [true, 'username is required'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  refresh_token: {
    type: String
  }
}, { strict: false, timestamps: true });

userSchema.pre('save', async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const secret = getSecret();
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      first_name: this.first_name,
      role_name: this.role_name
    },
    secret.accessTokenSecret,
    {
      expiresIn: secret.accessTokenExpiresIn
    } 
  );
};

userSchema.methods.generateRefreshToken = function () {
  const secret = secret();
  return jwt.sign(
    {
      id: this._id,
    },
    secret.refreshTokenSecret,
    {
      expiresIn: secret.refreshTokenExpiresIn
    }
  );
}

export default mongoose.model('users', userSchema);