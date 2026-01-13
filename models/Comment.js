const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
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
    image: {
      type: String,
      default: '/images/dummy-message.jpg'
    }
  },
  parentType: {
    type: String,
    enum: ['Achievement', 'Philanthropic'],
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parentType'
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  approved: {
    type: Boolean,
    default: false // Comments need admin approval
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
commentSchema.index({ parentType: 1, parentId: 1, approved: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

// Method to populate replies
commentSchema.methods.populateReplies = async function() {
  return await mongoose.model('Comment').find({ 
    parentComment: this._id, 
    approved: true 
  }).sort({ createdAt: 1 });
};

module.exports = mongoose.model('Comment', commentSchema);

