import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state && location.state.email ? location.state.email : '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp) {
      setError('Email and OTP are required');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5001/api/user/verify-email',
        { email, otp },
        { withCredentials: true }
      );

      setLoading(false);
      setSuccess(data.message || 'Email verified successfully!');
      alert('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message || `Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <section className="verification-section">
      <div className="verification-container">
        <h2 className="verification-title">Verify Your Email</h2>
        {error && <p className="verification-error">{error}</p>}
        {success && <p className="verification-success">{success}</p>}

        <form className="verification-form" onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Verification;
