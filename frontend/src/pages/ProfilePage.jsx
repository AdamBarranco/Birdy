import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import api from '../utils/api.js';
import ChirpCard from '../components/ChirpCard.jsx';
import Navbar from '../components/Navbar.jsx';

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const targetId = id ? parseInt(id, 10) : user.id;
  const isOwn = targetId === user.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${targetId}`);
      setProfile(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [targetId]);

  const handleFollow = async () => {
    setActionLoading(true);
    try {
      await api.post(`/users/${targetId}/follow`);
      loadProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setActionLoading(true);
    try {
      await api.post(`/users/${targetId}/unfollow`);
      loadProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePrivacy = async () => {
    setActionLoading(true);
    try {
      await api.put('/users/privacy');
      loadProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>
        <div className="loading">Loading profile...</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>
        <div className="error-msg">{error}</div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px' }}>
        <div className="profile-header">
          <div className="profile-avatar">{profile.username[0].toUpperCase()}</div>
          <div className="profile-username">@{profile.username}</div>
          {profile.is_private === 1 && (
            <span className="private-badge">🔒 Private</span>
          )}
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-count">{profile.followers}</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-count">{profile.following}</div>
              <div className="profile-stat-label">Following</div>
            </div>
          </div>
          <div className="profile-actions">
            {isOwn ? (
              <button
                className="btn btn-secondary"
                onClick={handleTogglePrivacy}
                disabled={actionLoading}
              >
                {profile.is_private ? '🔓 Make Public' : '🔒 Make Private'}
              </button>
            ) : (
              profile.is_following ? (
                <button className="btn btn-secondary" onClick={handleUnfollow} disabled={actionLoading}>
                  Unfollow
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleFollow} disabled={actionLoading}>
                  Follow
                </button>
              )
            )}
          </div>
        </div>

        {profile.private && !isOwn ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <p>This account is private. Follow to see their chirps.</p>
          </div>
        ) : (
          <>
            <h2 className="page-title">Chirps</h2>
            {!profile.chirps || profile.chirps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🐦</div>
                <p>No chirps yet.</p>
              </div>
            ) : (
              profile.chirps.map(chirp => <ChirpCard key={chirp.id} chirp={chirp} />)
            )}
          </>
        )}
      </div>
    </>
  );
}
