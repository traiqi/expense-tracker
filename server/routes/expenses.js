const router = require('express').Router();
const Expense = require('../models/Expense');
const UserActivity = require('../models/UserActivity');
const { requireAuth } = require('../middleware/auth');

// All expense routes require a logged-in user
router.use(requireAuth);

// GET all expenses for the logged-in user
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.user._id });
    const saved = await expense.save();

    await UserActivity.create({
      userId: req.user._id,
      action: 'create_expense',
      details: `Added "${saved.title}" ($${saved.amount})`,
    });

    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update expense (only owner can update)
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });

    Object.assign(expense, req.body);
    const updated = await expense.save();

    await UserActivity.create({
      userId: req.user._id,
      action: 'update_expense',
      details: `Updated "${updated.title}"`,
    });

    res.json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense (only owner can delete)
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });

    await UserActivity.create({
      userId: req.user._id,
      action: 'delete_expense',
      details: `Deleted "${expense.title}"`,
    });

    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
