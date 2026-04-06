import mongoose from "mongoose";
import dotenv from "dotenv";
import { Customer } from "../models/Customer.js";
import Item from "../models/Item.js";
import { connectDB } from "../config/db.js";

dotenv.config();
connectDB();

const seed = async () => {
  try {
    await Customer.deleteMany();
    await Item.deleteMany();

    const customers = await Customer.insertMany([
      { name: "Rajesh Sharma", openingBalance: 0, currentBalance: 0 },
      { name: "Priya Verma", openingBalance: 500, currentBalance: 500 },
    ]);

    const items = await Item.insertMany([
      { name: "Notebook", price: 50, isAvailable: true },
      { name: "Pen", price: 20, isAvailable: true },
      { name: "Eraser", price: 10, isAvailable: true },
    ]);

    console.log("Seed data inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();