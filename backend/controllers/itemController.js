import Item from "../models/Item.js";

// @desc    Get all items (available)
// @route   GET /api/items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ isAvailable: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new item
// @route   POST /api/items
export const createItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const item = new Item({ name, price, isAvailable: true });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};