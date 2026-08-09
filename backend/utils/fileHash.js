const crypto = require('crypto');

exports.computeFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};
