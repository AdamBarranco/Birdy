import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import api from '../utils/api.js';
import Navbar from '../components/Navbar.jsx';

function formatDate(ts) {
  return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/feed');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
      setStats(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user @${username}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h1 className="page-title">⚙️ Admin Dashboard</h1>

        {stats && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-card-value">{stats.totalUsers}</div>
              <div className="stat-card-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{stats.totalChirps}</div>
              <div className="stat-card-label">Total Chirps</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{stats.newUsersThisWeek}</div>
              <div className="stat-card-label">New This Week</div>
            </div>
          </div>
        )}

        {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Chirps</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>@{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.is_admin ? 'admin' : 'user'}`}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{u.chirp_count}</td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      {!u.is_admin && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u.id, u.username)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
