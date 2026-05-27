import { useState, useEffect } from 'react';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ACTION_LABELS = {
  login: '🔓 Login',
  logout: '🔒 Logout',
  register: '✅ Register',
  create_expense: '➕ Added expense',
  update_expense: '✏️ Edited expense',
  delete_expense: '🗑️ Deleted expense',
};

export default function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tab, setTab] = useState('users');
  const [message, setMessage] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchUsers();
    fetchActivities();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users', { headers });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      setMessage('Failed to load users.');
    }
  }

  async function fetchActivities() {
    try {
      const res = await fetch('/api/admin/activities', { headers });
      const data = await res.json();
      if (res.ok) setActivities(data);
    } catch (err) {
      setMessage('Failed to load activities.');
    }
  }

  async function toggleRole(user) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const res = await fetch(`/api/admin/users/${user._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      showMessage(`${user.name} is now ${newRole}.`);
    }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE', headers });
    if (res.ok) {
      setUsers(users.filter(u => u._id !== user._id));
      showMessage('User deleted.');
    }
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="admin-panel">
      <div className="page-header">
        <div>
          <h2 className="page-title">Admin Panel</h2>
          <p className="page-subtitle">Manage users and view activity logs</p>
        </div>
      </div>

      {message && <div className="notification">{message}</div>}

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Users ({users.length})
        </button>
        <button className={`tab-btn ${tab === 'activities' ? 'active' : ''}`} onClick={() => setTab('activities')}>
          Activity Log ({activities.length})
        </button>
      </div>

      {tab === 'users' && (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="cell-title">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  </td>
                  <td className="cell-date">{formatDate(user.createdAt)}</td>
                  <td className="cell-actions">
                    <button className="icon-btn" onClick={() => toggleRole(user)} title="Toggle role">
                      {user.role === 'admin' ? '⬇️' : '⬆️'}
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => deleteUser(user)} title="Delete user">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'activities' && (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(a => (
                <tr key={a._id}>
                  <td className="cell-title">{a.userId?.name || 'Deleted user'}</td>
                  <td>{ACTION_LABELS[a.action] || a.action}</td>
                  <td className="cell-desc">{a.details}</td>
                  <td className="cell-date">{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
