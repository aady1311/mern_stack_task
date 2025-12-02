import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', formData);
      setUserId(response.data.userId);
      setStep('otp');
      setMessage('OTP sent to your email. Please verify.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { userId, otp });
      setMessage('Account verified successfully!');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient">
      <div className="max-w-md w-full space-y-8">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold gradient-text">
              {step === 'signup' ? '✨ Create Account' : '🔐 Verify OTP'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 'signup' ? 'Join us today!' : 'Check your email for verification code'}
            </p>
          </div>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mb-6`}>
            {message}
          </div>
        )}

        {step === 'signup' ? (
          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <input
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
            🔙 Already have an account? Sign in
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;