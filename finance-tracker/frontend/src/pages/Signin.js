import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signin', formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signin failed');
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
              🔐 Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>
        
        {message && (
          <div className="alert alert-error mb-6">
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 block font-medium">
            🔑 Forgot Password?
          </Link>
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 block font-medium">
            ✨ Don't have an account? Sign up
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;