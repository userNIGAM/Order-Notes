/* eslint-disable no-unused-vars */
// src/pages/AddItem.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PackagePlus, ArrowLeft } from 'lucide-react';

const AddItem = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return alert('Name and price required');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/items', {
        name: form.name,
        price: Number(form.price),
      });
      alert('Item added successfully!');
      navigate('/items');
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto"
    >
      <button onClick={() => navigate('/items')} className="flex items-center gap-1 text-gray-500 mb-4 hover:text-black transition">
        <ArrowLeft size={16} /> Back to Items
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-xl text-white">
            <PackagePlus size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Add New Item</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-black/20 focus:border-black outline-none"
              placeholder="e.g., Notebook"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-black/20 focus:border-black outline-none"
              placeholder="99.00"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Add Item'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddItem;