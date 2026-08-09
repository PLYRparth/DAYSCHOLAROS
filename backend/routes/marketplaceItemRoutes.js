const express = require('express');
const { getAllItems, createItem } = require('../controllers/marketplaceItemController');
const verifyToken = require('../middleware/verifyToken');
const { uploadSingle, validateAndProcessUpload } = require('../middleware/uploadValidator');

const router = express.Router();

router.use(verifyToken);

router.route('/')
  .get(getAllItems)
  .post(uploadSingle, validateAndProcessUpload, createItem);

module.exports = router;
