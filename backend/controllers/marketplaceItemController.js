const MarketplaceItem = require('../models/MarketplaceItem');

exports.getAllItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find();
    res.status(200).json({ status: 'success', data: { items } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    req.body.seller_id = req.user.id;
    const newItem = await MarketplaceItem.create(req.body);
    res.status(201).json({ status: 'success', data: { item: newItem } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
