import mongoose from "mongoose";
import { getSecret } from "../../configuration";

export const connectMongo = async () => {
  try {
    const mongoUrl = getSecret.mongoUrl;
    await mongoose.connect(mongoUrl, {
      dbName: 'sakha'
    });
    console.log("Database connected successfully ✨");
  } catch (err) {
    console.error("Database connection error 💩");
  }
}