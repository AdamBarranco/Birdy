const chirpModel = require('../models/chirpModel');

function getFeed(req, res) {
  try {
    const chirps = chirpModel.getFeedChirps(req.user.id);
    return res.json({ chirps });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get feed' });
  }
}

function createChirp(req, res) {
  try {
    const { content } = req.body;
    if (!content || content.trim().length < 1 || content.length > 280) {
      return res.status(400).json({ error: 'Content must be between 1 and 280 characters' });
    }
    const result = chirpModel.createChirp(req.user.id, content.trim());
    const chirp = chirpModel.getChirpById(result.lastInsertRowid);
    return res.status(201).json({ chirp });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create chirp' });
  }
}

function addComment(req, res) {
  try {
    const { content } = req.body;
    const chirpId = parseInt(req.params.id, 10);

    if (!content || content.trim().length < 1 || content.length > 500) {
      return res.status(400).json({ error: 'Comment must be between 1 and 500 characters' });
    }

    const chirp = chirpModel.getChirpById(chirpId);
    if (!chirp) {
      return res.status(404).json({ error: 'Chirp not found' });
    }

    chirpModel.addComment(chirpId, req.user.id, content.trim());
    const comments = chirpModel.getComments(chirpId);
    return res.status(201).json({ comments });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add comment' });
  }
}

function likeChirp(req, res) {
  try {
    const chirpId = parseInt(req.params.id, 10);
    const chirp = chirpModel.getChirpById(chirpId);
    if (!chirp) {
      return res.status(404).json({ error: 'Chirp not found' });
    }
    chirpModel.addReaction(chirpId, req.user.id, 'like');
    const reactions = chirpModel.getReactions(chirpId);
    return res.json({ reactions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to like chirp' });
  }
}

function dislikeChirp(req, res) {
  try {
    const chirpId = parseInt(req.params.id, 10);
    const chirp = chirpModel.getChirpById(chirpId);
    if (!chirp) {
      return res.status(404).json({ error: 'Chirp not found' });
    }
    chirpModel.addReaction(chirpId, req.user.id, 'dislike');
    const reactions = chirpModel.getReactions(chirpId);
    return res.json({ reactions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to dislike chirp' });
  }
}

function getComments(req, res) {
  try {
    const chirpId = parseInt(req.params.id, 10);
    const comments = chirpModel.getComments(chirpId);
    return res.json({ comments });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get comments' });
  }
}

module.exports = { getFeed, createChirp, addComment, getComments, likeChirp, dislikeChirp };
