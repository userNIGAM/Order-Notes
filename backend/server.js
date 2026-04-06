import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import orderRoutes from "./routes/orderRoutes.js"
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

app.use(express.json())
app.use(cors({credentials : true}))

app.use("/api/customers",orderRoutes)

connectDB();
app.listen((PORT, req, res)=>{
    console.log(`Server Running on http://localhost:${PORT}`);
})