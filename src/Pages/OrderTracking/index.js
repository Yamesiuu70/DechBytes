import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const OrderTracking = () => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;

      try {
        const res = await fetch("http://localhost:5001/api/orders/user", {
          headers: {
            "Content-Type": "application/json",
            // assuming JWT is in cookies
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  if (!userInfo) return <p>Please log in to see your orders.</p>;
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <section className="order-tracking-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <h3>Order ID: {order.orderId}</h3>
          <p>Status: {order.payment_status}</p>
          <p>Total: ${order.totalAmt.toFixed(2)}</p>
          <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>

          <h4>Products:</h4>
          <ul>
            {order.product_details.map((item, idx) => (
              <li key={idx}>
                {item.name} x {item.quantity} → ${item.price * item.quantity}
              </li>
            ))}
          </ul>

          <h4>Delivery Address:</h4>
          <p>{order.delivery_address.name}</p>
          <p>{order.delivery_address.email}</p>
          <p>{order.delivery_address.phone}</p>
          <p>{order.delivery_address.address}</p>
        </div>
      ))}
    </section>
  );
};

export default OrderTracking;
