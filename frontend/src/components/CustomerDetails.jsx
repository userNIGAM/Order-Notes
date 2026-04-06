/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Search } from "lucide-react";

const CustomerDetails = ({ customer, onClose }) => {
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!customer) return;

    const fetchData = async () => {
      try {
        const [ledgerRes, itemsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/ledger/${customer._id}`),
          axios.get("http://localhost:5000/api/items"),
        ]);

        setLedger(ledgerRes.data.ledger);
        setSummary(ledgerRes.data.summary);
        setItems(itemsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [customer]);

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

  const updateQty = (id, qty) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.itemId === id ? { ...i, quantity: qty } : i)),
    );
  };

  const removeItem = (id) => {
    setSelectedItems((prev) => prev.filter((i) => i.itemId !== id));
  };

  const submitOrder = async () => {
    if (selectedItems.length === 0) return;

    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerId: customer._id,
        items: selectedItems,
      });

      setShowAddModal(false);
      setSelectedItems([]);

      // refresh ledger
      const res = await axios.get(
        `http://localhost:5000/api/ledger/${customer._id}`,
      );
      setLedger(res.data.ledger);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {/* <div>Hello</div> */}
      {customer && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <p className="text-sm text-gray-500">
                  Balance: Rs. {summary?.balance || 0}
                </p>
              </div>
              <X className="cursor-pointer" onClick={onClose} />
            </div>

            {/* Actions */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl"
              >
                <Plus size={16} /> Add Items
              </button>
            </div>

            {/* Ledger */}
            <div className="max-h-80 overflow-y-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    ledger.map((entry) => (
                      <tr key={entry.id} className="border-t">
                        <td className="p-2">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="p-2">{entry.description}</td>
                        <td
                          className={`p-2 text-right ${
                            entry.amount > 0 ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {entry.amount}
                        </td>
                        <td className="p-2 text-right">{entry.balance}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Items Modal */}
            <AnimatePresence>
              {showAddModal && (
                <motion.div
                  className="fixed inset-0 bg-black/40 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white w-full max-w-lg p-6 rounded-2xl"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                  >
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold">Add Items</h3>
                      <X
                        className="cursor-pointer"
                        onClick={() => setShowAddModal(false)}
                      />
                    </div>

                    {/* Items */}
                    <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                      {items.map((item) => (
                        <div key={item._id} className="flex justify-between">
                          <span>{item.name}</span>
                          <button
                            onClick={() => addItem(item)}
                            className="text-sm bg-black text-white px-2 py-1 rounded"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Selected */}
                    <div className="space-y-2 mb-4">
                      {selectedItems.map((i) => (
                        <div
                          key={i.itemId}
                          className="flex justify-between items-center"
                        >
                          <span>{i.name}</span>
                          <input
                            type="number"
                            value={i.quantity}
                            min="1"
                            onChange={(e) =>
                              updateQty(i.itemId, Number(e.target.value))
                            }
                            className="w-16 border rounded px-2"
                          />
                          <button onClick={() => removeItem(i.itemId)}>
                            remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={submitOrder}
                      className="w-full bg-black text-white py-2 rounded-xl"
                    >
                      Submit
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomerDetails;
