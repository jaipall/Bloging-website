import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MOGO_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MOGO_URI/MONGO_URI environment variable");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};

export default connectDB;
