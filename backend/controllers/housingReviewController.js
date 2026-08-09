const HousingReview = require('../models/HousingReview');

exports.getAllHousingReviews = async (req, res) => {
  try {
    const reviews = await HousingReview.find();
    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createHousingReview = async (req, res) => {
  try {
    // Attach the authenticated user's ID to the reviewer_id field
    req.body.reviewer_id = req.user.id;
    const newReview = await HousingReview.create(req.body);
    res.status(201).json({ status: 'success', data: { review: newReview } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
