import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/feed" className="navbar-logo">🐦 Birdy</Link>
      <div className="navbar-links">
        <Link to="/feed">Feed</Link>
        <Link to="/profile">Profile</Link>
        {user?.is_admin === 1 && <Link to="/admin">Admin</Link>}
      </div>
      <div className="navbar-user">
        <span className="navbar-username">@{user?.username}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
