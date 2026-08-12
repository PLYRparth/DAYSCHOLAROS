const express = require('express');
const { reportNoShow, getPublicRooms } = require('../controllers/commuteController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.post('/no-show', reportNoShow);
router.get('/rooms', getPublicRooms);

module.exports = router;
