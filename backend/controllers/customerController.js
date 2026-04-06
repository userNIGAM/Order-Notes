import { Customer } from "../models/Customer.js";

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, openingBalance = 0 } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const customer = new Customer({
      name,
      openingBalance,
      currentBalance: openingBalance,
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};