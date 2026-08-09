const TiffinVendor = require('../models/TiffinVendor');

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await TiffinVendor.find();
    res.status(200).json({ status: 'success', data: { vendors } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const newVendor = await TiffinVendor.create(req.body);
    res.status(201).json({ status: 'success', data: { vendor: newVendor } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
