const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['Legislative', 'Community', 'Education', 'Healthcare', 'Infrastructure', 'Other'],
    default: 'Other'
  },
  image: {
    type: String,
    default: '/images/dummy-achievement.jpg'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

achievementSchema.index({ date: -1 });
achievementSchema.index({ order: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);

