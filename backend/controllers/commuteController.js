const User = require('../models/User');
const CommuteRequest = require('../models/CommuteRequest');

exports.reportNoShow = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({ status: 'fail', message: 'Target User ID is required' });
    }

    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Deduct reliability score by 1, with a minimum of 0
    targetUser.reliabilityScore = Math.max(0, targetUser.reliabilityScore - 1);
    await targetUser.save({ validateBeforeSave: false });

    res.status(200).json({ 
      status: 'success', 
      message: 'User reported successfully as No-Show. Reliability score updated.',
      data: {
        reliabilityScore: targetUser.reliabilityScore
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getPublicRooms = async (req, res) => {
  try {
    const rooms = await CommuteRequest.find({ isPrivate: false }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { rooms } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
