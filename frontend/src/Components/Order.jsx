import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  // 🔹 Fetch customers & items
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

  // 🔍 Filter customers
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧾 Add item to order
  const addItem = (item) => {
    const exists = selectedItems.find((i) => i.itemId === item._id);

    if (exists) {
      setSelectedItems((prev) =>
        prev.map((i) =>
          i.itemId === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { itemId: item._id, name: item.name, quantity: 1 },
      ]);
    }
  };

  // ➕ Change quantity
  const updateQuantity = (itemId, value) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, quantity: value } : i
      )
    );
  };

  // ❌ Remove item
  const removeItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.filter((i) => i.itemId !== itemId)
    );
  };

  // 🚀 Submit Order
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

      // reset
      setSelectedItems([]);
      setShowModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Order</h2>

      {/* 🔍 Search Customer */}
      <input
        type="text"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      {/* 👤 Customer List */}
      <div style={{ marginTop: "20px" }}>
        {filteredCustomers.map((c) => (
          <div
            key={c._id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedCustomer(c);
              setShowModal(true);
            }}
          >
            {c.name} (Balance: Rs. {c.currentBalance})
          </div>
        ))}
      </div>

      {/* 🧾 Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              margin: "50px auto",
              width: "500px",
            }}
          >
            <h3>Add Items - {selectedCustomer?.name}</h3>

            {/* 🍜 Item List */}
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {item.name} (Rs. {item.price})
                  </span>
                  <button onClick={() => addItem(item)}>Add</button>
                </div>
              ))}
            </div>

            <hr />

            {/* 🧾 Selected Items */}
            <h4>Selected Items</h4>

            {selectedItems.map((i) => (
              <div key={i.itemId} style={{ marginBottom: "10px" }}>
                {i.name}
                <input
                  type="number"
                  value={i.quantity}
                  min="1"
                  onChange={(e) =>
                    updateQuantity(i.itemId, Number(e.target.value))
                  }
                  style={{ width: "60px", marginLeft: "10px" }}
                />
                <button onClick={() => removeItem(i.itemId)}>
                  Remove
                </button>
              </div>
            ))}

            <br />

            <button onClick={handleSubmit}>Submit Order</button>
            <button onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;