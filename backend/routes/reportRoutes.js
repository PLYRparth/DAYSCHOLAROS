const express = require('express');
const { getAllReports, createReport } = require('../controllers/reportController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.route('/')
  .get(getAllReports)
  .post(createReport);

module.exports = router;
