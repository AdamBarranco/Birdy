import React, { useState } from 'react';
import api from '../utils/api.js';

const MAX = 280;

export default function CreateChirp({ onChirpCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const remaining = MAX - content.length;
  const countClass = remaining < 20 ? 'danger' : remaining < 50 ? 'warning' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/chirps', { content: content.trim() });
      setContent('');
      if (onChirpCreated) onChirpCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post chirp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-chirp">
      {error && <div className="error-msg mb-8">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-textarea"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={MAX}
          rows={3}
        />
        <div className="create-chirp-footer">
          <span className={`char-count ${countClass}`}>{content.length} / {MAX}</span>
          <button className="btn btn-primary" type="submit" disabled={loading || !content.trim() || content.length > MAX}>
            {loading ? 'Posting...' : '🐦 Chirp'}
          </button>
        </div>
      </form>
    </div>
  );
}
