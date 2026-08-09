const Report = require('../models/Report');

exports.getPendingReports = async (req, res) => {
  try {
    // Extra security check for admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Forbidden: Admins only' });
    }
    
    // Sort by most recent first
    const reports = await Report.find({ status: 'pending' }).sort({ created_at: -1 });
    res.status(200).json({ status: 'success', data: { reports } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Forbidden: Admins only' });
    }
    
    const { status } = req.body;
    if (!['upheld', 'dismissed'].includes(status)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!report) {
      return res.status(404).json({ status: 'fail', message: 'Report not found' });
    }

    res.status(200).json({ status: 'success', data: { report } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
