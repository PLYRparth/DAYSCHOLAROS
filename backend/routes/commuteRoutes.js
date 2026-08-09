const express = require('express');
const { reportNoShow } = require('../controllers/commuteController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.post('/no-show', reportNoShow);

module.exports = router;
