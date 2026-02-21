import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const Dashboard = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [helps, setHelps] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [message, setMessage] = useState("");

  // Add product states
  const [categoryName, setCategoryName] = useState("Arm");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!userInfo || userInfo.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/dashboard/users", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/dashboard/products", {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED FUNCTION: fetchReports now maps user info
  const fetchReports = async () => { // ✅
    try {
      const res = await fetch("http://localhost:5001/api/dashboard/reports", {
        credentials: "include",
      });
      const data = await res.json();
      // ✅ map reports to include user info
      const mappedReports = (data.reports || []).map(r => ({
        _id: r._id,
        opinion: r.opinion,
        createdAt: r.createdAt,
        user: r.userId
          ? { name: r.userId.name, email: r.userId.email }
          : { name: "Unknown", email: "Unknown" },
      }));
      setReports(mappedReports); // ✅
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHelps = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/dashboard/helps", {
        credentials: "include",
      });
      const data = await res.json();
      setHelps(data.helps || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {   // ✅ added
    try {
      const res = await fetch("http://localhost:5001/api/dashboard/orders", {
        credentials: "include",
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  



  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "users") fetchUsers();
    if (tab === "products") fetchProducts();
    if (tab === "reports") fetchReports();
    if (tab === "helps") fetchHelps();
    if (tab === "orders") fetchOrders();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5001/api/dashboard/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ categoryName, name, price, photo, details }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Product added successfully!");
        setName("");
        setPrice("");
        setPhoto("");
        setDetails("");
        fetchProducts();
      } else {
        setMessage(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };




    // ✅ Logout function with green tick
    const handleLogout = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/dashboard/logout", {
          method: "POST",
          credentials: "include",
        });
  
        if (res.ok) {
          setMessage({ text: "Logged out successfully ✅", type: "success" });
          navigate("/login");
        } else {
          const data = await res.json();
          setMessage({ text: data.message || "Logout failed ❌", type: "error" });
        }
      } catch (err) {
        console.error(err);
        setMessage({ text: "Logout failed ❌", type: "error" });
      }
    };









  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li onClick={() => handleTabClick("home")}>Dashboard</li>
          <li onClick={() => handleTabClick("users")}>Users</li>
          <li onClick={() => handleTabClick("products")}>Products</li>
          <li onClick={() => handleTabClick("addProduct")}>Add Product</li>
          <li onClick={() => handleTabClick("orders")}>Orders</li>
          <li onClick={() => handleTabClick("reports")}>Reports</li>
          <li onClick={() => handleTabClick("helps")}>Help</li>
          <li onClick={handleLogout}>Logout</li>

        </ul>
      </aside>

      <main className="dashboard-main">


          {/* ✅ Display message */}
          {message.text && (
          <p style={{ color: message.type === "success" ? "green" : "red", fontWeight: "bold" }}>
            {message.text}
          </p>
        )}





        {activeTab === "home" && (
          <>
            <h1>Welcome, {userInfo.name}</h1>
            <section className="dashboard-cards">
              <div className="card">Users: {stats.userCount}</div>
              <div className="card">Products: {stats.productCount}</div>
              <div className="card">Orders: {stats.orderCount}</div>
              <div className="card">Reports: {stats.reportCount}</div>
              <div className="card">Help Requests: {stats.helpCount}</div>
            </section>
          </>
        )}

        {activeTab === "users" && (
          <div className="table-container">
            <h2>All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && (
          <div className="table-container">
            <h2>All Products</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Photo</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.category}</td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>
                      <img src={p.photo} alt={p.name} width="80" />
                    </td>
                    <td>{p.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "addProduct" && (
          <div className="add-product-form">
            <h2>Add Product</h2>
            <form onSubmit={handleAddProduct}>
              <label>
                Category:
                <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
                  <option value="Arm">Arm</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Leg">Leg</option>
                </select>
              </label>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <input type="text" placeholder="Photo URL" value={photo} onChange={(e) => setPhoto(e.target.value)} required />
              <textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} required />
              <button type="submit">Add Product</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        )}




        {activeTab === "orders" && (
          <div className="table-container">
            <h2>All Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Products</th>
                  <th>Subtotal</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.orderId}</td>
                      <td>{order.userId}</td>
                      <td>
                        {order.product_details?.map((p, i) => (
                          <div key={i}>
                            {p.name} × {p.quantity}
                          </div>
                        ))}
                      </td>
                      <td>${order.subTotalAmt}</td>
                      <td>${order.totalAmt}</td>
                      <td>{order.payment_status}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}







        {activeTab === "reports" && (
          <div className="table-container">
            <h2>All Reports</h2>
            <table>
              <thead>
                <tr>
                  <th>User Name</th> {/* ✅ */}
                  <th>User Email</th> {/* ✅ */}
                  <th>Opinion</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td>{r.user.name}</td> {/* ✅ */}
                    <td>{r.user.email}</td> {/* ✅ */}
                    <td>{r.opinion}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}




        {activeTab === "helps" && (
          <div className="table-container">
            <h2>All Help Requests</h2>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {helps.map((h) => (
                  <tr key={h._id}>
                    <td>{h.email}</td>
                    <td>{h.message}</td>
                    <td>{new Date(h.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}








      </main>
    </div>
  );
};


export default Dashboard;
