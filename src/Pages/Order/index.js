import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const Order = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const cart = state?.cart || [];
  const total = state?.total || 0;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill form if user is logged in
  useEffect(() => {
    if (userInfo) {
      setForm({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill all fields");
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: userInfo._id,
          products: cart.map((item) => ({
            name: item.product.name,
            image: item.product.photo,
            quantity: item.quantity,
            price: item.product.price,
          })),
          delivery_address: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
          },
          subTotalAmt: total,
          totalAmt: total,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Order failed");
      }

      alert("✅ Order placed successfully!");
      navigate("/"); // Go back home
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return <p className="error">Please log in to place an order.</p>;
  }

  return (
    <section className="order-page">
      <h2>Order Summary</h2>
      <div className="order-summary">
        {cart.map((item, idx) => (
          <div key={idx} className="order-item">
            <span>{item.product.name} (x{item.quantity})</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
      </div>

      <h3>Shipping Information</h3>
      <div className="order-form">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <input type="text" name="address" placeholder="Shipping Address" value={form.address} onChange={handleChange} />

        {error && <p className="error">{error}</p>}
        <button onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </section>
  );
};

export default Order;
