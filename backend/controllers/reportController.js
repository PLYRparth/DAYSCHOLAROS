const Report = require('../models/Report');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ status: 'success', data: { reports } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createReport = async (req, res) => {
  try {
    req.body.reporter_id = req.user.id;
    const newReport = await Report.create(req.body);
    res.status(201).json({ status: 'success', data: { report: newReport } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
