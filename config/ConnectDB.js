import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB =  () => {
    mongoose.connect(process.env.MONGODB_URL) 
        .then(() => console.log("MongoDB connected successfully"))
        .catch((err) => console.log("MongoDB connection error: ", err));
};
