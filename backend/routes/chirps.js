const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const chirpController = require('../controllers/chirpController');

router.use(auth);

router.get('/', chirpController.getFeed);
router.post('/', chirpController.createChirp);
router.get('/:id/comments', chirpController.getComments);
router.post('/:id/comment', chirpController.addComment);
router.post('/:id/like', chirpController.likeChirp);
router.post('/:id/dislike', chirpController.dislikeChirp);

module.exports = router;
