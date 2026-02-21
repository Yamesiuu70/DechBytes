import React, { useState } from "react";

const AddProduct = () => {
  const [categoryName, setCategoryName] = useState("Arm");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        setMessage(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Photo URL" value={photo} onChange={(e) => setPhoto(e.target.value)} required />
        <textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} required />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#1e3a8a", color: "white", border: "none", cursor: "pointer" }}>
          Add Product
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
