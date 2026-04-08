import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';

const API = '/api/expenses';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState('expenses');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Load all expenses when the page first loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setMessage('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(formData) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add expense.');
      setExpenses([data, ...expenses]);
      setShowForm(false);
      showMessage('Expense added!');
    } catch (err) {
      showMessage(err.message);
    }
  }

  async function handleUpdate(formData) {
    try {
      const res = await fetch(`${API}/${editingExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update expense.');
      setExpenses(expenses.map(e => (e._id === data._id ? data : e)));
      setShowForm(false);
      setEditingExpense(null);
      showMessage('Expense updated!');
    } catch (err) {
      showMessage(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense.');
      setExpenses(expenses.filter(e => e._id !== id));
      showMessage('Expense deleted.');
    } catch (err) {
      showMessage(err.message);
    }
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  function openAddForm() {
    setEditingExpense(null);
    setShowForm(true);
  }

  function openEditForm(expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingExpense(null);
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">💰</span>
          <h1>ExpenseTracker</h1>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${view === 'expenses' ? 'active' : ''}`}
            onClick={() => setView('expenses')}
          >
            <span className="nav-icon">📋</span>
            Expenses
          </button>
          <button
            className={`nav-item ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            <span className="nav-icon">📊</span>
            Analytics
          </button>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-label">Total Spent</p>
          <p className="sidebar-footer-amount">${total.toFixed(2)}</p>
          <p className="sidebar-footer-count">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </p>
        </div>
      </aside>

      <main className="main-content">
        {message && <div className="notification">{message}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading expenses...</p>
          </div>
        ) : view === 'expenses' ? (
          <ExpenseList
            expenses={expenses}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onAdd={openAddForm}
          />
        ) : (
          <Analytics expenses={expenses} />
        )}
      </main>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={editingExpense ? handleUpdate : handleAdd}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
