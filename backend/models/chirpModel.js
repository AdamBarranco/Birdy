const db = require('../database');

const createChirp = (userId, content) =>
  db.prepare('INSERT INTO chirps (user_id, content) VALUES (?, ?)').run(userId, content);

const getFeedChirps = (currentUserId) =>
  db.prepare(`
    SELECT
      c.id,
      c.user_id,
      c.content,
      c.created_at,
      u.username,
      (SELECT COUNT(*) FROM reactions r WHERE r.chirp_id = c.id AND r.type = 'like') AS likes,
      (SELECT COUNT(*) FROM reactions r WHERE r.chirp_id = c.id AND r.type = 'dislike') AS dislikes,
      (SELECT COUNT(*) FROM comments cm WHERE cm.chirp_id = c.id) AS comment_count
    FROM chirps c
    JOIN users u ON u.id = c.user_id
    WHERE c.user_id = ?
      OR c.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
    ORDER BY c.created_at DESC
  `).all(currentUserId, currentUserId);

const getChirpById = (id) =>
  db.prepare('SELECT * FROM chirps WHERE id = ?').get(id);

const addComment = (chirpId, userId, content) =>
  db.prepare(
    'INSERT INTO comments (chirp_id, user_id, content) VALUES (?, ?, ?)'
  ).run(chirpId, userId, content);

const getComments = (chirpId) =>
  db.prepare(`
    SELECT cm.*, u.username
    FROM comments cm
    JOIN users u ON u.id = cm.user_id
    WHERE cm.chirp_id = ?
    ORDER BY cm.created_at ASC
  `).all(chirpId);

const addReaction = (chirpId, userId, type) =>
  db.prepare(
    'INSERT OR REPLACE INTO reactions (chirp_id, user_id, type) VALUES (?, ?, ?)'
  ).run(chirpId, userId, type);

const removeReaction = (chirpId, userId) =>
  db.prepare('DELETE FROM reactions WHERE chirp_id = ? AND user_id = ?').run(chirpId, userId);

const getReactions = (chirpId) =>
  db.prepare('SELECT * FROM reactions WHERE chirp_id = ?').all(chirpId);

const getUserChirps = (userId) =>
  db.prepare(`
    SELECT
      c.id,
      c.user_id,
      c.content,
      c.created_at,
      u.username,
      (SELECT COUNT(*) FROM reactions r WHERE r.chirp_id = c.id AND r.type = 'like') AS likes,
      (SELECT COUNT(*) FROM reactions r WHERE r.chirp_id = c.id AND r.type = 'dislike') AS dislikes,
      (SELECT COUNT(*) FROM comments cm WHERE cm.chirp_id = c.id) AS comment_count
    FROM chirps c
    JOIN users u ON u.id = c.user_id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `).all(userId);

const deleteChirp = (id) =>
  db.prepare('DELETE FROM chirps WHERE id = ?').run(id);

module.exports = {
  createChirp,
  getFeedChirps,
  getChirpById,
  addComment,
  getComments,
  addReaction,
  removeReaction,
  getReactions,
  getUserChirps,
  deleteChirp,
};
