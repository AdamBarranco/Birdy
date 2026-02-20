const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');

function listUsers(req, res) {
  try {
    const users = adminModel.getAllUsers();
    const stats = adminModel.getUserStats();
    return res.json({ users, stats });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list users' });
  }
}

function deleteUser(req, res) {
  try {
    const targetId = parseInt(req.params.id, 10);
    const user = userModel.findById(targetId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.is_admin === 1) {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }
    adminModel.deleteUser(targetId);
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = { listUsers, deleteUser };
