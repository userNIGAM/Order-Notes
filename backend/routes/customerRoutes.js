import express from "express";
import { getCustomers, createCustomer } from "../controllers/customerController.js";

const router = express.Router();

router.route("/").get(getCustomers).post(createCustomer);

export default router;