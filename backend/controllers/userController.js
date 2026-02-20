const userModel = require('../models/userModel');
const chirpModel = require('../models/chirpModel');

function getProfile(req, res) {
  try {
    const targetId = parseInt(req.params.id, 10);
    const user = userModel.findById(targetId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followers = userModel.getFollowerCount(targetId);
    const following = userModel.getFollowingCount(targetId);
    const isOwn = req.user.id === targetId;
    const following_me = userModel.isFollowing(req.user.id, targetId);

    if (user.is_private && !isOwn && !following_me) {
      return res.json({
        id: user.id,
        username: user.username,
        is_private: user.is_private,
        followers,
        following,
        private: true,
      });
    }

    const chirps = chirpModel.getUserChirps(targetId);

    return res.json({
      id: user.id,
      username: user.username,
      email: isOwn ? user.email : undefined,
      is_admin: user.is_admin,
      is_private: user.is_private,
      created_at: user.created_at,
      followers,
      following,
      is_following: following_me,
      chirps,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get profile' });
  }
}

function followUser(req, res) {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (targetId === req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    const target = userModel.findById(targetId);
    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }
    userModel.followUser(req.user.id, targetId);
    return res.json({ message: 'Followed successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to follow user' });
  }
}

function unfollowUser(req, res) {
  try {
    const targetId = parseInt(req.params.id, 10);
    userModel.unfollowUser(req.user.id, targetId);
    return res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to unfollow user' });
  }
}

function togglePrivacy(req, res) {
  try {
    const user = userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newPrivacy = user.is_private === 1 ? 0 : 1;
    userModel.updatePrivacy(req.user.id, newPrivacy);
    return res.json({ is_private: newPrivacy });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle privacy' });
  }
}

module.exports = { getProfile, followUser, unfollowUser, togglePrivacy };
