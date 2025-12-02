import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setUserId(response.data.userId);
      setStep('reset');
      setMessage('OTP sent to your email');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { userId, otp, newPassword });
      setMessage('Password reset successfully!');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password reset failed');
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
              {step === 'email' ? '🔑 Forgot Password' : '🔒 Reset Password'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 'email' ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
            </p>
          </div>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mb-6`}>
            {message}
          </div>
        )}

        {step === 'email' ? (
          <form className="space-y-6" onSubmit={handleSendOTP}>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
            🔙 Back to Sign In
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;