const db = require('../database');

const findByEmail = (email) =>
  db.prepare('SELECT * FROM users WHERE email = ?').get(email);

const findById = (id) =>
  db.prepare('SELECT * FROM users WHERE id = ?').get(id);

const findByUsername = (username) =>
  db.prepare('SELECT * FROM users WHERE username = ?').get(username);

const create = ({ username, email, password_hash }) =>
  db.prepare(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
  ).run(username, email, password_hash);

const updatePrivacy = (id, is_private) =>
  db.prepare('UPDATE users SET is_private = ? WHERE id = ?').run(is_private, id);

const setResetToken = (email, token, expires) =>
  db.prepare(
    'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?'
  ).run(token, expires, email);

const findByResetToken = (token) =>
  db.prepare(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?'
  ).get(token, Math.floor(Date.now() / 1000));

const clearResetToken = (id) =>
  db.prepare(
    'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?'
  ).run(id);

const deleteUser = (id) =>
  db.prepare('DELETE FROM users WHERE id = ?').run(id);

const getAllUsers = () =>
  db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();

const getFollowerCount = (id) =>
  db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(id).count;

const getFollowingCount = (id) =>
  db.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').get(id).count;

const isFollowing = (followerId, followingId) =>
  !!db.prepare(
    'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?'
  ).get(followerId, followingId);

const followUser = (followerId, followingId) =>
  db.prepare(
    'INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)'
  ).run(followerId, followingId);

const unfollowUser = (followerId, followingId) =>
  db.prepare(
    'DELETE FROM follows WHERE follower_id = ? AND following_id = ?'
  ).run(followerId, followingId);

module.exports = {
  findByEmail,
  findById,
  findByUsername,
  create,
  updatePrivacy,
  setResetToken,
  findByResetToken,
  clearResetToken,
  deleteUser,
  getAllUsers,
  getFollowerCount,
  getFollowingCount,
  isFollowing,
  followUser,
  unfollowUser,
};
