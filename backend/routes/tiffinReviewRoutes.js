const express = require('express');
const { getAllReviews, createReview } = require('../controllers/tiffinReviewController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.route('/')
  .get(getAllReviews)
  .post(createReview);

module.exports = router;
