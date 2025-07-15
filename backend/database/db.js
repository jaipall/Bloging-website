import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MOGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};

export default connectDB;
