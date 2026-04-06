/* eslint-disable no-unused-vars */
// src/pages/Items.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Trash2, Package } from "lucide-react";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item? It may affect existing orders.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      fetchItems();
    } catch (err) {
      alert("Delete failed. Item might be linked to orders.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Items</h2>
          <p className="text-gray-500 text-sm">Manage products & pricing</p>
        </div>
        <Link
          to="/items/add"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
        >
          <Plus size={16} /> Add Item
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Price (Rs.)
                </th>
                <th className="text-right p-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center p-8 text-gray-400">
                    Loading items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-8 text-gray-400">
                    No items yet.{" "}
                    <Link to="/items/add" className="text-black underline">
                      Add one
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="p-4 text-gray-700">Rs. {item.price}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-400 hover:text-red-600 transition p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Items;
