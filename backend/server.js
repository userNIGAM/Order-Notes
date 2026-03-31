import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

connectDB();
app.listen((PORT, req, res)=>{
    console.log(`Server Running on http://localhost:${PORT}`);
})