const StudyMaterial = require('../models/StudyMaterial');

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find();
    res.status(200).json({ status: 'success', data: { materials } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    req.body.uploader_id = req.user.id;
    if (req.file) {
      req.body.file_url = req.file.file_url;
      req.body.fileHash = req.file.fileHash;
    }
    const newMaterial = await StudyMaterial.create(req.body);
    res.status(201).json({ status: 'success', data: { material: newMaterial } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
