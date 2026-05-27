import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Entertainment',
  'Healthcare', 'Shopping', 'Education', 'Others',
];

export default function ExpenseForm({ expense, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Food',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [error, setError] = useState('');

  // If editing an existing expense, populate the form with its data
  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        category: expense.category,
        amount: expense.amount.toString(),
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description || '',
      });
    }
  }, [expense]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.amount || parseFloat(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.date) return setError('Date is required.');

    await onSubmit({ ...form, amount: parseFloat(form.amount) });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Add Expense'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount ($) *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
