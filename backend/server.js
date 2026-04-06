import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import customerRoutes from "./routes/customerRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true }));

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/ledger", orderRoutes); // ledger endpoint uses orderRoutes
app.use("/api/orders", orderRoutes); // orders endpoints also in orderRoutes

// Connect to DB and start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});