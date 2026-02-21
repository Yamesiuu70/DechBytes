import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import './style.css';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const [user, setUser] = useState(userInfo);

  useEffect(() => {
    if (!userInfo) navigate("/login");
    else setUser(userInfo);
  }, [userInfo, navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5001/api/user/logout", { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const handleEditProfile = () => navigate("/profile/edit");

  if (!user) return <div className="profile-loading">Loading...</div>;

  // ✅ Fix address display
  const formatAddress = (addresses) => {
    if (!addresses || addresses.length === 0) return "No address";
    if (Array.isArray(addresses)) {
      return addresses.map(addr => 
        `${addr.address_line}, ${addr.city}, ${addr.state} - ${addr.pincode}`
      ).join(" | ");
    }
    return addresses;
  };

  return (
    <section className="profile-section">
      <div className="profile-container">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Address:</strong> {formatAddress(user.address_details)}</p>
        </div>

        <div className="profile-buttons">
          <button onClick={handleEditProfile} className="profile-edit-btn">Edit Profile</button>
          <button onClick={handleLogout} className="profile-logout-btn">Logout</button>
        </div>
      </div>
    </section>
  );
};

export default Profile;