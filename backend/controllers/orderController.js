import mongoose from "mongoose";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { Customer } from "../models/Customer.js";
import Item from "../models/Item.js";

// @desc    Get customer ledger (orders + payments)
// @route   GET /api/ledger/:customerId
export const getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { from, to } = req.query;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customerId" });
    }

    let dateFilter = {};
    if (from || to) {
      dateFilter = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) }),
      };
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orders = await Order.find({
      customerId,
      ...(from || to ? { date: dateFilter } : {}),
    }).lean();

    const payments = await Payment.find({
      customerId,
      ...(from || to ? { paymentDate: dateFilter } : {}),
    }).lean();

    const orderEntries = orders.map((order) => ({
      id: order._id.toString(),
      type: "order",
      date: order.date,
      amount: order.totalAmount,
      description: order.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
      createdAt: order.createdAt,
    }));

    const paymentEntries = payments.map((payment) => ({
      id: payment._id.toString(),
      type: "payment",
      date: payment.paymentDate,
      amount: -payment.amountPaid,
      description: `Payment (${payment.method})`,
      createdAt: payment.createdAt,
    }));

    let ledger = [...orderEntries, ...paymentEntries];
    ledger.sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    let runningBalance = 0;
    const finalLedger = ledger.map((entry) => {
      runningBalance += entry.amount;
      return { ...entry, balance: runningBalance };
    });

    const totalOrders = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalPayments = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      customer: {
        id: customer._id,
        name: customer.name,
        currentBalance: customer.currentBalance,
      },
      summary: {
        totalOrders,
        totalPayments,
        balance: runningBalance,
      },
      ledger: finalLedger,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ledger",
      error: error.message,
    });
  }
};

// @desc    Create a new order (and update customer balance)
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { customerId, items } = req.body;
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer and items are required" });
    }

    // Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch item details
    const itemIds = items.map((i) => i.itemId);
    const itemDocs = await Item.find({ _id: { $in: itemIds } });
    const itemMap = new Map(itemDocs.map((doc) => [doc._id.toString(), doc]));

    let totalAmount = 0;
    const orderItems = items.map((i) => {
      const item = itemMap.get(i.itemId);
      if (!item) throw new Error(`Item ${i.itemId} not found`);
      const subtotal = item.price * i.quantity;
      totalAmount += subtotal;
      return {
        itemId: i.itemId,
        name: item.name,
        quantity: i.quantity,
        price: item.price,
      };
    });

    const order = new Order({
      customerId,
      items: orderItems,
      totalAmount,
      date: new Date(),
    });
    await order.save();

    // Update customer balance (debit)
    customer.currentBalance += totalAmount;
    await customer.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all orders (for dashboard stats)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name")
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};