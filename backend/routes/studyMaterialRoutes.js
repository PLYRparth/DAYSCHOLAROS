const express = require('express');
const { getAllMaterials, createMaterial, upvoteMaterial } = require('../controllers/studyMaterialController');
const verifyToken = require('../middleware/verifyToken');
const { uploadSingle, validateAndProcessUpload } = require('../middleware/uploadValidator');

const router = express.Router();

router.use(verifyToken);

router.route('/')
  .get(getAllMaterials)
  .post(uploadSingle, validateAndProcessUpload, createMaterial);

router.put('/:id/upvote', upvoteMaterial);

module.exports = router;
