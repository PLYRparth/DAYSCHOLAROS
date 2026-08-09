const express = require('express');
const { getAllVendors, createVendor } = require('../controllers/tiffinVendorController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken); // Apply middleware to all routes

router.route('/')
  .get(getAllVendors)
  .post(createVendor);

module.exports = router;
