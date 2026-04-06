// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Package, TrendingUp } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({ customers: 0, items: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [custRes, itemRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customers'),
          axios.get('http://localhost:5000/api/items'),
          axios.get('http://localhost:5000/api/orders'),
        ]);
        setStats({
          customers: custRes.data.length,
          items: itemRes.data.length,
          orders: orderRes.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Customers', value: stats.customers, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { title: 'Inventory Items', value: stats.items, icon: Package, color: 'from-emerald-500 to-teal-600' },
    { title: 'Orders Placed', value: stats.orders, icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-8">Welcome back! Here's your business snapshot.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl text-white shadow-sm`}>
                <card.icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
        <p className="text-sm text-gray-500">Use the sidebar to manage customers, items, and track orders.</p>
        <div className="flex gap-3 mt-4">
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">✨ Add new customer</span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">📦 Create order from customer details</span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">📊 Track ledger balances</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;