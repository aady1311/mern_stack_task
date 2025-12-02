import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Home = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: { total: 0 }, expense: { total: 0 }, balance: 0 });
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: ''
  });
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        ...filters
      });
      
      const response = await api.get(`/transactions?${params}`);
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current]);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions]);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/transactions/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({ type: 'income', description: '', amount: '' });
      fetchTransactions();
      fetchSummary();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, current: 1 });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient animated-gradient">
      <nav className="nav-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">💰 Finance Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user?.username}</span>
              <a href="/profile" className="text-white hover:text-blue-300 font-medium transition-colors">👤 Profile</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 float-animation">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-green-600">💵 Total Income</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.income.total)}</p>
                <div className="text-sm text-gray-500 mt-1">{summary.income.count || 0} transactions</div>
              </div>
              <div className="text-4xl pulse-animation">📈</div>
            </div>
          </div>
          <div className="card p-6 float-animation" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-red-600">💸 Total Expenses</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.expense.total)}</p>
                <div className="text-sm text-gray-500 mt-1">{summary.expense.count || 0} transactions</div>
              </div>
              <div className="text-4xl pulse-animation">📉</div>
            </div>
          </div>
          <div className="card p-6 float-animation" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-600">💰 Net Balance</h3>
                <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.balance)}
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  {summary.balance >= 0 ? 'Positive' : 'Negative'} balance
                </div>
              </div>
              <div className="text-4xl pulse-animation">{summary.balance >= 0 ? '✅' : '⚠️'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4 gradient-text">➕ Add Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Transaction
                </button>
              </form>
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4 gradient-text">📊 Recent Transactions</h2>
              
              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="createdAt">Date</option>
                  <option value="amount">Amount</option>
                  <option value="type">Type</option>
                </select>
              </div>

              {/* Transactions Table */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="loading mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading transactions...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`badge ${
                                transaction.type === 'income' 
                                  ? 'badge-income' 
                                  : 'badge-expense'
                              }`}>
                                {transaction.type === 'income' ? '💵 Income' : '💸 Expense'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-700">
                      Showing {transactions.length} of {pagination.total} transactions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                        disabled={pagination.current === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1">
                        Page {pagination.current} of {pagination.pages}
                      </span>
                      <button
                        onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                        disabled={pagination.current === pagination.pages}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;