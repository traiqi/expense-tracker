import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import AdminPanel from './components/AdminPanel';

const API = '/api/expenses';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // checking stored token on load

  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState('expenses');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // On first load, check if there's a saved token
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${savedToken}` } })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Fetch expenses whenever user logs in
  useEffect(() => {
    if (user && token) fetchExpenses();
  }, [user, token]);

  function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }

  async function fetchExpenses() {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      showMessage('Could not load expenses.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(formData) {
    try {
      const res = await fetch(API, { method: 'POST', headers: authHeaders(), body: JSON.stringify(formData) });
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
      const res = await fetch(`${API}/${editingExpense._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(formData) });
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
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to delete expense.');
      setExpenses(expenses.filter(e => e._id !== id));
      showMessage('Expense deleted.');
    } catch (err) {
      showMessage(err.message);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (_) {}
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setExpenses([]);
    setView('expenses');
  }

  function handleLogin(loggedInUser, newToken) {
    setUser(loggedInUser);
    setToken(newToken);
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  function openAddForm() { setEditingExpense(null); setShowForm(true); }
  function openEditForm(expense) { setEditingExpense(expense); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingExpense(null); }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Still verifying stored token
  if (authLoading) {
    return (
      <div className="loading-state" style={{ height: '100vh' }}>
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in — show auth page
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">💰</span>
          <h1>ExpenseTracker</h1>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${view === 'expenses' ? 'active' : ''}`} onClick={() => setView('expenses')}>
            <span className="nav-icon">📋</span> Expenses
          </button>
          <button className={`nav-item ${view === 'analytics' ? 'active' : ''}`} onClick={() => setView('analytics')}>
            <span className="nav-icon">📊</span> Analytics
          </button>
          {user.role === 'admin' && (
            <button className={`nav-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
              <span className="nav-icon">🛡️</span> Admin
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-label">Total Spent</p>
          <p className="sidebar-footer-amount">${total.toFixed(2)}</p>
          <p className="sidebar-footer-count">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
          <div className="sidebar-user">
            <p className="sidebar-user-name">{user.name}</p>
            {user.role === 'admin' && <span className="admin-badge">admin</span>}
            <button className="logout-btn" onClick={handleLogout}>Sign out</button>
          </div>
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
          <ExpenseList expenses={expenses} onEdit={openEditForm} onDelete={handleDelete} onAdd={openAddForm} />
        ) : view === 'analytics' ? (
          <Analytics expenses={expenses} />
        ) : (
          <AdminPanel token={token} />
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
