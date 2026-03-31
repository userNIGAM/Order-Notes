import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb Connected !!")
    } catch (error) {
        console.log("Failed to connect to DB due to -> ", error)
        process.exit(1)
    }
}