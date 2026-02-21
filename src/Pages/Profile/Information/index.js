import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth';  // ✅ Import useAuth
import './style.css';

const ProfileInformation = () => {
  const navigate = useNavigate();
  const { userInfo, updateProfile } = useAuth();  // ✅ Get updateProfile
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address_details: [],
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/user/profile', {
          withCredentials: true,
        });
        
        const addresses = data.address_details || [];
        
        setForm({
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          address_details: addresses.length ? addresses : [],
          password: '',
          confirmPassword: '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
        if (err.response?.status === 401) navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e, index, field) => {
    if (field) {
      const updated = [...form.address_details];
      updated[index] = { ...updated[index], [field]: e.target.value };
      setForm({ ...form, address_details: updated });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addAddressField = () => {
    setForm({ 
      ...form, 
      address_details: [
        ...form.address_details, 
        { address_line: '', city: '', state: '', pincode: '', country: '', mobile: '' }
      ] 
    });
  };

  const removeAddressField = (i) => {
    setForm({ 
      ...form, 
      address_details: form.address_details.filter((_, idx) => idx !== i) 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      delete updateData.confirmPassword;
  
      // Send to backend
      const response = await axios.put('http://localhost:5001/api/user/profile/update', updateData, {
        withCredentials: true,
      });
  
      // ✅ Update AuthContext with new data
      if (response.data.success) {
        updateProfile(response.data.data);  // This updates userInfo in context
        
        setSuccess('Profile updated successfully');
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <section className="profile-section">
      <div className="profile-container">
        <h2 className="profile-title">Edit Profile</h2>
        {error && <p className="profile-error">{error}</p>}
        {success && <p className="profile-success">{success}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Mobile:</label>
          <input type="text" name="mobile" value={form.mobile} onChange={handleChange} required />

          <label>Addresses:</label>
          {form.address_details.map((addr, i) => (
            <div key={i} className="address-card" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <input 
                type="text" 
                placeholder="Address Line" 
                value={addr.address_line || ''} 
                onChange={(e) => handleChange(e, i, 'address_line')} 
              />
              <input 
                type="text" 
                placeholder="City" 
                value={addr.city || ''} 
                onChange={(e) => handleChange(e, i, 'city')} 
              />
              <input 
                type="text" 
                placeholder="State" 
                value={addr.state || ''} 
                onChange={(e) => handleChange(e, i, 'state')} 
              />
              <input 
                type="text" 
                placeholder="Pincode" 
                value={addr.pincode || ''} 
                onChange={(e) => handleChange(e, i, 'pincode')} 
              />
              <input 
                type="text" 
                placeholder="Country" 
                value={addr.country || ''} 
                onChange={(e) => handleChange(e, i, 'country')} 
              />
              <input 
                type="text" 
                placeholder="Mobile" 
                value={addr.mobile || ''} 
                onChange={(e) => handleChange(e, i, 'mobile')} 
              />
              {form.address_details.length > 1 && (
                <button type="button" onClick={() => removeAddressField(i)}>Remove</button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addAddressField}>Add Address</button>

          <label>New Password (optional):</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />

          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />

          <div className="profile-buttons">
            <button type="submit" className="profile-save-btn">Save Changes</button>
            <button type="button" onClick={() => navigate('/profile')} className="profile-cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileInformation;