const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(auth);

// PUT /privacy MUST be before GET /:id to avoid "privacy" being treated as an id
router.put('/privacy', userController.togglePrivacy);
router.get('/:id', userController.getProfile);
router.post('/:id/follow', userController.followUser);
router.post('/:id/unfollow', userController.unfollowUser);

module.exports = router;
