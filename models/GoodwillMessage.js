const mongoose = require('mongoose');

const goodwillMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: '/images/dummy-message.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

goodwillMessageSchema.index({ verified: 1, createdAt: -1 });

module.exports = mongoose.model('GoodwillMessage', goodwillMessageSchema);

