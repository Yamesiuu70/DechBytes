// src/components/CarbonFootprintDisplay/index.js
import React, { useState, useEffect } from "react";
import { useCarbonFootprint } from "react-carbon-footprint";
import "./style.css"; // Your CSS file

const CarbonFootprintDisplay = () => {
  // Client/browser footprint (this session only)
  const [gCO2, bytesTransferred] = useCarbonFootprint();

  // Backend footprint
  const [backendBytes, setBackendBytes] = useState(0);
  const [backendCO2, setBackendCO2] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch backend carbon stats
  const fetchBackendCarbon = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/carbon-stats", {
        credentials: "include",
      });
      const data = await response.json();
      setBackendBytes(data.bytes || 0);
      setBackendCO2(data.emissions || 0);
    } catch (err) {
      console.error("Failed to fetch backend carbon stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    fetchBackendCarbon();
  }, []);

  return (
    <div className="carbon-footprint-container">
      <h3>Network Carbon Footprint</h3>

      {/* Client footprint */}
      <p><strong>Client (this session):</strong></p>
      <p>Bytes Transferred: {bytesTransferred} bytes</p>
      <p>CO₂ Emissions: {gCO2.toFixed(2)} gCO₂eq</p>

      <hr />

      {/* Server footprint */}
      <p><strong>Server:</strong></p>
      <p>Bytes Transferred: {backendBytes} bytes</p>
      <p>CO₂ Emissions: {backendCO2.toFixed(3)} gCO₂eq</p>

      <button
        onClick={fetchBackendCarbon}
        disabled={loading}
        className="carbon-refresh-btn"
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>

      <p className="carbon-footprint-note">
        (Client = this session, Server = API requests)
      </p>
    </div>
  );
};

export default CarbonFootprintDisplay;
