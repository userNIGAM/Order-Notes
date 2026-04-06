// src/pages/Customers.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import CustomerDetails from "../components/CustomerDetails";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-500 text-sm">
            View customer profiles and transaction history
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer, idx) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Balance:{" "}
                  <span
                    className={`font-medium ${customer.currentBalance >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    Rs. {customer.currentBalance}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(customer)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-xl text-sm transition-colors"
              >
                <Eye size={14} /> Details
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-400 border-t border-gray-50 pt-2">
              ID: {customer._id.slice(-6)}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400 bg-white rounded-2xl border">
            No customers found
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </motion.div>
  );
};

export default Customers;
