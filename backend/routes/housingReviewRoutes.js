const express = require('express');
const { getAllHousingReviews, createHousingReview } = require('../controllers/housingReviewController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken); // Apply middleware to all routes

router.route('/')
  .get(getAllHousingReviews)
  .post(createHousingReview);

module.exports = router;
