const TiffinReview = require('../models/TiffinReview');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await TiffinReview.find();
    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    req.body.reviewer_id = req.user.id;
    const newReview = await TiffinReview.create(req.body);
    res.status(201).json({ status: 'success', data: { review: newReview } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
