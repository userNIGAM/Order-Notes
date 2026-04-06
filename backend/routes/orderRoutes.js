import express from "express";
import {
  getCustomerLedger,
  createOrder,
  getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// Ledger
router.get("/:customerId", getCustomerLedger);

// Orders
router.route("/").post(createOrder).get(getAllOrders);

export default router;