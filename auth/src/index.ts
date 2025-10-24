import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
  app.listen(3000, () => {
    console.log("Auth service listening on port 3000...");
  });
};

start();
