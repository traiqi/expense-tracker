import { useState } from 'react';

const CATEGORIES = [
  'All', 'Food', 'Transport', 'Housing', 'Entertainment',
  'Healthcare', 'Shopping', 'Education', 'Others',
];

const CATEGORY_COLORS = {
  Food: '#ef4444', Transport: '#3b82f6', Housing: '#f59e0b',
  Entertainment: '#14b8a6', Healthcare: '#8b5cf6',
  Shopping: '#f97316', Education: '#22c55e', Others: '#94a3b8',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function ExpenseList({ expenses, onEdit, onDelete, onAdd }) {
  const [filterCategory, setFilterCategory] = useState('All');

  // Filter the list by the selected category
  const filtered = filterCategory === 'All'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="expense-list">
      <div className="page-header">
        <div>
          <h2 className="page-title">Expenses</h2>
          <p className="page-subtitle">Track and manage your spending</p>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>+ Add Expense</button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Category</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="results-summary">
          {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
          {filterCategory !== 'All' && ' in ' + filterCategory}
          {' — '}Total: <strong>${filteredTotal.toFixed(2)}</strong>
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{expenses.length === 0 ? '📭' : '🔍'}</div>
          <p>
            {expenses.length === 0
              ? 'No expenses yet. Add your first one!'
              : 'No expenses in this category.'}
          </p>
          {expenses.length === 0 && (
            <button className="btn btn-primary" onClick={onAdd}>Add Expense</button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(expense => (
                <tr key={expense._id}>
                  <td className="cell-title">{expense.title}</td>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: (CATEGORY_COLORS[expense.category] || '#94a3b8') + '18',
                        color: CATEGORY_COLORS[expense.category] || '#94a3b8',
                        borderColor: (CATEGORY_COLORS[expense.category] || '#94a3b8') + '60',
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="cell-amount">${expense.amount.toFixed(2)}</td>
                  <td className="cell-date">{formatDate(expense.date)}</td>
                  <td className="cell-desc">
                    {expense.description
                      ? <span title={expense.description}>{expense.description}</span>
                      : <span className="text-muted">—</span>}
                  </td>
                  <td className="cell-actions">
                    <button className="icon-btn" onClick={() => onEdit(expense)} title="Edit">✏️</button>
                    <button className="icon-btn delete-btn" onClick={() => onDelete(expense._id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
