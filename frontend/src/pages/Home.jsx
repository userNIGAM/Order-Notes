import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Plus, Trash2 } from "lucide-react";

const CustomerItems = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);

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

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const submitOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerId: selectedCustomer._id,
        items: cart,
      });
      alert("Order Created");
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Order</h2>

      {/* Search Customer */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {filteredCustomers.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedCustomer(c)}
            className={`p-4 border rounded-xl cursor-pointer ${selectedCustomer?._id === c._id ? "border-blue-500 bg-blue-50" : ""}`}
          >
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-gray-500">{c.phone}</p>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Items List */}
          <div className="bg-white p-4 rounded-xl border">
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border p-2 rounded-lg"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">Rs {item.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-blue-500 text-white p-2 rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white p-4 rounded-xl border">
            <h3 className="font-semibold mb-3">Cart</h3>
            <div className="space-y-2">
              {cart.map((i) => (
                <div
                  key={i._id}
                  className="flex justify-between items-center border p-2 rounded-lg"
                >
                  <div>
                    <p>{i.name}</p>
                    <p className="text-xs text-gray-500">Qty: {i.qty}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(i._id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <button
                onClick={submitOrder}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-xl"
              >
                Create Order
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerItems;
