/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Trash2 } from "lucide-react";
import CustomerDetails from "./CustomerDetails";

const Order = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, itemRes] = await Promise.all([
          axios.get("http://localhost:5000/api/customers"),
          axios.get("http://localhost:5000/api/items"),
        ]);
        setCustomers(custRes.data);
        setItems(itemRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addItem = (item) => {
    const exists = selectedItems.find((i) => i.itemId === item._id);
    if (exists) {
      setSelectedItems((prev) =>
        prev.map((i) =>
          i.itemId === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { itemId: item._id, name: item.name, quantity: 1 },
      ]);
    }
  };

  const updateQuantity = (itemId, value) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, quantity: value } : i)),
    );
  };

  const removeItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || selectedItems.length === 0) {
      alert("Select customer and items");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerId: selectedCustomer._id,
        items: selectedItems.map((i) => ({
          itemId: i.itemId,
          quantity: i.quantity,
        })),
      });

      alert("Order added!");
      setSelectedItems([]);
      setShowModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Order</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-black outline-none"
        />
      </div>

      {/* Customers */}
      <div className="grid gap-3">
        {filteredCustomers.map((c) => (
          <motion.div
            key={c._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border rounded-2xl shadow-sm cursor-pointer flex justify-between"
            onClick={() => {
              setSelectedCustomer(c);
              setShowCustomerDetails(true);
            }}
          >
            <span className="font-medium">{c.name}</span>
            <span className="text-sm text-gray-500">
              Rs. {c.currentBalance}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedCustomer?.name}
                </h3>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowModal(false)}
                />
              </div>

              {/* Items */}
              <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {item.name} - Rs. {item.price}
                    </span>
                    <button
                      onClick={() => addItem(item)}
                      className="flex items-center gap-1 text-sm bg-black text-white px-2 py-1 rounded-lg"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                ))}
              </div>

              {/* Selected */}
              <h4 className="font-medium mb-2">Selected Items</h4>
              <div className="space-y-2 mb-4">
                {selectedItems.map((i) => (
                  <div
                    key={i.itemId}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm flex-1">{i.name}</span>
                    <input
                      type="number"
                      min="1"
                      value={i.quantity}
                      onChange={(e) =>
                        updateQuantity(i.itemId, Number(e.target.value))
                      }
                      className="w-16 border rounded-lg px-2 py-1"
                    />
                    <Trash2
                      className="cursor-pointer text-red-500"
                      size={16}
                      onClick={() => removeItem(i.itemId)}
                    />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl bg-black text-white"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showCustomerDetails && selectedCustomer && (
          <CustomerDetails
            customer={selectedCustomer}
            onClose={() => setShowCustomerDetails(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
