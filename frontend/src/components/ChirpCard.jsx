import React, { useState } from 'react';
import api from '../utils/api.js';
import CommentSection from './CommentSection.jsx';

function formatTime(ts) {
  const date = new Date(ts * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ChirpCard({ chirp }) {
  const [likes, setLikes] = useState(chirp.likes || 0);
  const [dislikes, setDislikes] = useState(chirp.dislikes || 0);
  const [commentCount, setCommentCount] = useState(chirp.comment_count || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const res = await api.post(`/chirps/${chirp.id}/like`);
      const reactions = res.data.reactions || [];
      setLikes(reactions.filter(r => r.type === 'like').length);
      setDislikes(reactions.filter(r => r.type === 'dislike').length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await api.post(`/chirps/${chirp.id}/dislike`);
      const reactions = res.data.reactions || [];
      setLikes(reactions.filter(r => r.type === 'like').length);
      setDislikes(reactions.filter(r => r.type === 'dislike').length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chirp-card">
      <div className="chirp-header">
        <div className="chirp-avatar">{chirp.username[0].toUpperCase()}</div>
        <div className="chirp-meta">
          <div className="chirp-username">@{chirp.username}</div>
          <div className="chirp-time">{formatTime(chirp.created_at)}</div>
        </div>
      </div>
      <div className="chirp-content">{chirp.content}</div>
      <div className="chirp-actions">
        <button className="chirp-action-btn" onClick={handleLike}>👍 {likes}</button>
        <button className="chirp-action-btn" onClick={handleDislike}>👎 {dislikes}</button>
        <button className="chirp-action-btn" onClick={() => setShowComments(prev => !prev)}>
          💬 {commentCount}
        </button>
      </div>
      {showComments && <CommentSection chirpId={chirp.id} />}
    </div>
  );
}
