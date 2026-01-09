const mongoose = require('mongoose');

const philanthropicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  impact: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

philanthropicSchema.index({ date: -1 });

module.exports = mongoose.model('Philanthropic', philanthropicSchema);

