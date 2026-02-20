import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import api from '../utils/api.js';
import ChirpCard from '../components/ChirpCard.jsx';
import CreateChirp from '../components/CreateChirp.jsx';

export default function FeedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chirps, setChirps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const loadFeed = async () => {
    try {
      const res = await api.get('/chirps');
      setChirps(res.data.chirps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.get(`/users/${user.id}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFeed();
    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">🐦 Birdy</div>
        {profile && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.username[0].toUpperCase()}</div>
            <div className="sidebar-username">@{user.username}</div>
            <div className="sidebar-stats">
              <span><span>{profile.followers}</span> Followers</span>
              <span><span>{profile.following}</span> Following</span>
            </div>
          </div>
        )}
        <nav className="sidebar-nav">
          <Link to="/feed" className="active">🏠 Feed</Link>
          <Link to="/profile">👤 My Profile</Link>
          {user?.is_admin === 1 && <Link to="/admin">⚙️ Admin</Link>}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%' }}>Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <h1 className="page-title">Feed</h1>
        <CreateChirp onChirpCreated={loadFeed} />
        {loading ? (
          <div className="loading">Loading chirps...</div>
        ) : chirps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🐦</div>
            <p>No chirps yet. Follow some users or post your first chirp!</p>
          </div>
        ) : (
          chirps.map(chirp => <ChirpCard key={chirp.id} chirp={chirp} />)
        )}
      </main>
    </div>
  );
}
