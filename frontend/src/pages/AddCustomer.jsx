/* eslint-disable no-unused-vars */
// src/pages/AddCustomer.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', openingBalance: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Customer name required');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/customers', {
        name: form.name,
        openingBalance: Number(form.openingBalance) || 0,
      });
      alert('Customer added successfully!');
      navigate('/customers');
    } catch (err) {
      console.error(err);
      alert('Error adding customer');
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
      <button onClick={() => navigate('/customers')} className="flex items-center gap-1 text-gray-500 mb-4 hover:text-black transition">
        <ArrowLeft size={16} /> Back to Customers
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-xl text-white">
            <UserPlus size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Add New Customer</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-black/20 focus:border-black outline-none"
              placeholder="e.g., Rajesh Sharma"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance (Rs.)</label>
            <input
              type="number"
              value={form.openingBalance}
              onChange={(e) => setForm({ ...form, openingBalance: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-black/20 focus:border-black outline-none"
              placeholder="0"
            />
            <p className="text-xs text-gray-400 mt-1">Positive = customer owes you, Negative = you owe customer</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddCustomer;