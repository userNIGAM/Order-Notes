import mongoose from "mongoose";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import {Customer} from "../models/Customer.js";

export const getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { from, to } = req.query;

    // 🔍 Validate customerId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customerId" });
    }

    // 📅 Date filter setup
    let dateFilter = {};

    if (from || to) {
      dateFilter = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) })
      };
    }

    // 👤 Check customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 🧾 Fetch Orders
    const orders = await Order.find({
      customerId,
      ...(from || to ? { date: dateFilter } : {})
    }).lean();

    // 💰 Fetch Payments
    const payments = await Payment.find({
      customerId,
      ...(from || to ? { paymentDate: dateFilter } : {})
    }).lean();

    // 🔁 Normalize Orders
    const orderEntries = orders.map(order => ({
      id: order._id,
      type: "order",
      date: order.date,
      amount: order.totalAmount, // + debit
      description: order.items
        .map(i => `${i.name} x${i.quantity}`)
        .join(", "),
      createdAt: order.createdAt
    }));

    // 🔁 Normalize Payments
    const paymentEntries = payments.map(payment => ({
      id: payment._id,
      type: "payment",
      date: payment.paymentDate,
      amount: -payment.amountPaid, // - credit
      description: `Payment (${payment.method})`,
      createdAt: payment.createdAt
    }));

    // 🔗 Combine
    let ledger = [...orderEntries, ...paymentEntries];

    // 🔃 Sort (date first, then createdAt)
    ledger.sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // 🧮 Running Balance
    let runningBalance = 0;

    const finalLedger = ledger.map(entry => {
      runningBalance += entry.amount;

      return {
        ...entry,
        balance: runningBalance
      };
    });

    // 📊 Summary
    const totalOrders = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalPayments = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    // 📦 Response
    res.status(200).json({
      customer: {
        id: customer._id,
        name: customer.name,
        currentBalance: customer.currentBalance
      },
      summary: {
        totalOrders,
        totalPayments,
        balance: runningBalance
      },
      ledger: finalLedger
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ledger",
      error: error.message
    });
  }
};