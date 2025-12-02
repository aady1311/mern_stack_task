import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setUserId(response.data.userId);
      setStep('otp');
      setMessage('OTP sent to your email for verification');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-change-password', {
        userId,
        otp,
        newPassword: passwordData.newPassword
      });
      setMessage('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setOtp('');
      setStep('form');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient">
      <nav className="nav-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white gradient-text">💰 Finance Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-white hover:text-blue-500 font-medium">🏠 Home</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-6 gradient-text">👤 User Profile</h2>
          
          {message && (
            <div className={`alert mb-6 ${
              message.includes('success') ? 'alert-success' : 'alert-error'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                  {user?.username}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                  ••••••••
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            {/* Change Password Form */}
            {showChangePassword && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 gradient-text">
                  {step === 'form' ? '🔒 Change Password' : '🔐 Verify OTP'}
                </h3>
                
                {step === 'form' ? (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Send OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowChangePassword(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyChangePassword} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify & Change Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep('form');
                          setOtp('');
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;