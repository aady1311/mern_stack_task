const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get transactions with filters, sorting, and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      type, 
      startDate, 
      endDate, 
      minAmount, 
      maxAmount, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, description, amount } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      type,
      description,
      amount
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction summary
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      income: { total: 0, count: 0 },
      expense: { total: 0, count: 0 }
    };

    summary.forEach(item => {
      result[item._id] = { total: item.total, count: item.count };
    });

    result.balance = result.income.total - result.expense.total;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;