const express = require('express');
const { getPendingReports, updateReportStatus } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(verifyToken);

router.route('/reports')
  .get(getPendingReports);

router.route('/reports/:id')
  .patch(updateReportStatus);

module.exports = router;
