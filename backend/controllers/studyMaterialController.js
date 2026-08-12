const StudyMaterial = require('../models/StudyMaterial');

exports.getAllMaterials = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { subject_tag: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const materials = await StudyMaterial.find(query).sort('-created_at');
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

exports.upvoteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ status: 'fail', message: 'Material not found' });
    }
    
    const userId = req.user.id;
    const hasUpvoted = material.upvotedBy && material.upvotedBy.includes(userId);
    
    if (hasUpvoted) {
      // Remove upvote
      material.upvotes = Math.max(0, material.upvotes - 1);
      material.upvotedBy = material.upvotedBy.filter(id => id.toString() !== userId);
    } else {
      // Add upvote
      material.upvotes += 1;
      if (!material.upvotedBy) material.upvotedBy = [];
      material.upvotedBy.push(userId);
    }
    
    await material.save();
    
    res.status(200).json({ status: 'success', data: { material } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
