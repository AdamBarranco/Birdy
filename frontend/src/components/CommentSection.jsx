import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';

function formatTime(ts) {
  const date = new Date(ts * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CommentSection({ chirpId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/chirps/${chirpId}/comments`).then(res => {
      setComments(res.data.comments || []);
    }).catch(() => {});
  }, [chirpId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await api.post(`/chirps/${chirpId}/comment`, { content });
      setComments(res.data.comments || []);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section">
      {comments.length === 0 && (
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 10 }}>No comments yet.</p>
      )}
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-avatar">{comment.username[0].toUpperCase()}</div>
          <div className="comment-body">
            <span className="comment-username">{comment.username}</span>
            <span className="comment-time" style={{ marginLeft: 8 }}>{formatTime(comment.created_at)}</span>
            <p className="comment-text">{comment.content}</p>
          </div>
        </div>
      ))}
      <form className="comment-input-row" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={500}
        />
        <button className="btn btn-primary btn-sm" type="submit" disabled={loading || !content.trim()}>
          Post
        </button>
      </form>
    </div>
  );
}
