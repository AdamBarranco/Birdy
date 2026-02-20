const db = require('../database');

const getAllUsers = () =>
  db.prepare(`
    SELECT u.id, u.username, u.email, u.is_admin, u.is_private, u.created_at,
      (SELECT COUNT(*) FROM chirps c WHERE c.user_id = u.id) AS chirp_count
    FROM users u
    ORDER BY u.created_at DESC
  `).all();

const deleteUser = (id) =>
  db.prepare('DELETE FROM users WHERE id = ?').run(id);

const getUserStats = () => {
  const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalChirps = db.prepare('SELECT COUNT(*) as count FROM chirps').get().count;
  const newUsersThisWeek = db.prepare(
    'SELECT COUNT(*) as count FROM users WHERE created_at >= ?'
  ).get(oneWeekAgo).count;
  return { totalUsers, totalChirps, newUsersThisWeek };
};

module.exports = { getAllUsers, deleteUser, getUserStats };
