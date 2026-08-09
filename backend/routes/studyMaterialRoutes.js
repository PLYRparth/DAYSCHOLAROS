const express = require('express');
const { getAllMaterials, createMaterial } = require('../controllers/studyMaterialController');
const verifyToken = require('../middleware/verifyToken');
const { uploadSingle, validateAndProcessUpload } = require('../middleware/uploadValidator');

const router = express.Router();

router.use(verifyToken);

router.route('/')
  .get(getAllMaterials)
  .post(uploadSingle, validateAndProcessUpload, createMaterial);

module.exports = router;
