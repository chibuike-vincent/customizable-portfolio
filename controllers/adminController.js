const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Achievement = require('../models/Achievement');
const Philanthropic = require('../models/Philanthropic');
const GoodwillMessage = require('../models/GoodwillMessage');
const Settings = require('../models/Settings');
const Comment = require('../models/Comment');
const { deleteImage, deleteImages } = require('../config/cloudinary');

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [profile, achievements, philanthropic, messages, settings] = await Promise.all([
      Profile.findOne(),
      Achievement.countDocuments(),
      Philanthropic.countDocuments(),
      GoodwillMessage.countDocuments(),
      Settings.getSettings()
    ]);

    const verifiedMessages = await GoodwillMessage.countDocuments({ verified: true });
    const unverifiedMessages = await GoodwillMessage.countDocuments({ verified: false });

    res.render('admin/dashboard', {
      layout: 'layouts/admin',
      profile,
      stats: {
        achievements,
        philanthropic,
        totalMessages: messages,
        verifiedMessages,
        unverifiedMessages
      },
      settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Profile Management
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        name: 'Your Name',
        title: 'Politician',
        bio: 'Enter your biography here...',
        image: '/images/dummy-profile.jpg'
      });
    }
    res.render('admin/profile', { layout: 'layouts/admin', profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    const updateData = {
      name: req.body.name,
      title: req.body.title,
      bio: req.body.bio,
      socialLinks: {
        facebook: req.body.facebook || '',
        twitter: req.body.twitter || '',
        instagram: req.body.instagram || '',
        linkedin: req.body.linkedin || ''
      },
      updatedAt: new Date()
    };

    if (req.file) {
      // Delete old image from Cloudinary if exists and not default
      if (profile && profile.image && !profile.image.includes('dummy') && !profile.image.includes('/images/')) {
        await deleteImage(profile.image);
      }
      // Cloudinary returns the URL in req.file.path
      updateData.image = req.file.path;
    }

    if (!profile) {
      profile = await Profile.create(updateData);
    } else {
      profile = await Profile.findOneAndUpdate({}, updateData, { new: true });
    }

    req.flash = req.flash || function() {};
    res.redirect('/admin/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Achievements Management
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.render('admin/achievements', { layout: 'layouts/admin', achievements });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const achievementData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      category: req.body.category,
      order: parseInt(req.body.order) || 0
    };

    if (req.file) {
      // Cloudinary returns the URL in req.file.path
      achievementData.image = req.file.path;
    }

    await Achievement.create(achievementData);
    res.redirect('/admin/achievements');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).send('Achievement not found');
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      category: req.body.category,
      order: parseInt(req.body.order) || 0
    };

    if (req.file) {
      // Delete old image from Cloudinary
      if (achievement.image && !achievement.image.includes('dummy') && !achievement.image.includes('/images/')) {
        await deleteImage(achievement.image);
      }
      // Cloudinary returns the URL in req.file.path
      updateData.image = req.file.path;
    }

    await Achievement.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/achievements');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (achievement && achievement.image && !achievement.image.includes('dummy') && !achievement.image.includes('/images/')) {
      await deleteImage(achievement.image);
    }
    await Achievement.findByIdAndDelete(req.params.id);
    res.redirect('/admin/achievements');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Philanthropic Management
exports.getPhilanthropic = async (req, res) => {
  try {
    const philanthropic = await Philanthropic.find().sort({ date: -1 });
    res.render('admin/philanthropic', { layout: 'layouts/admin', philanthropic });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createPhilanthropic = async (req, res) => {
  try {
    const philanthropicData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      impact: req.body.impact
    };

    if (req.files && req.files.length > 0) {
      // Cloudinary returns the URL in req.file.path
      philanthropicData.images = req.files.map(file => file.path);
    }

    await Philanthropic.create(philanthropicData);
    res.redirect('/admin/philanthropic');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updatePhilanthropic = async (req, res) => {
  try {
    const philanthropic = await Philanthropic.findById(req.params.id);
    if (!philanthropic) {
      return res.status(404).send('Philanthropic activity not found');
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      impact: req.body.impact
    };

    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (philanthropic.images && philanthropic.images.length > 0) {
        await deleteImages(philanthropic.images.filter(img => !img.includes('dummy') && !img.includes('/images/')));
      }
      // Cloudinary returns the URL in req.file.path
      updateData.images = req.files.map(file => file.path);
    }

    await Philanthropic.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/philanthropic');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deletePhilanthropic = async (req, res) => {
  try {
    const philanthropic = await Philanthropic.findById(req.params.id);
    if (philanthropic && philanthropic.images && philanthropic.images.length > 0) {
      await deleteImages(philanthropic.images.filter(img => !img.includes('dummy') && !img.includes('/images/')));
    }
    await Philanthropic.findByIdAndDelete(req.params.id);
    res.redirect('/admin/philanthropic');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Goodwill Messages Management
exports.getMessages = async (req, res) => {
  try {
    const messages = await GoodwillMessage.find().sort({ createdAt: -1 });
    res.render('admin/messages', { layout: 'layouts/admin', messages });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.verifyMessage = async (req, res) => {
  try {
    await GoodwillMessage.findByIdAndUpdate(req.params.id, { verified: true });
    res.redirect('/admin/messages');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.unverifyMessage = async (req, res) => {
  try {
    await GoodwillMessage.findByIdAndUpdate(req.params.id, { verified: false });
    res.redirect('/admin/messages');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await GoodwillMessage.findById(req.params.id);
    
    if (!message) {
      return res.redirect('/admin/messages?error=Message not found');
    }

    // Delete image from Cloudinary if it exists
    if (message.image && !message.image.includes('dummy') && !message.image.includes('/images/')) {
      try {
        await deleteImage(message.image);
      } catch (imageError) {
        console.error('Error deleting image from Cloudinary:', imageError);
        // Continue with message deletion even if image deletion fails
      }
    }

    await GoodwillMessage.findByIdAndDelete(req.params.id);
    res.redirect('/admin/messages?success=Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
    res.redirect('/admin/messages?error=Failed to delete message');
  }
};

// Settings Management
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.render('admin/settings', { layout: 'layouts/admin', settings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteTitle: req.body.siteTitle,
        siteDescription: req.body.siteDescription,
        contactEmail: req.body.contactEmail
      });
    } else {
      settings.siteTitle = req.body.siteTitle;
      settings.siteDescription = req.body.siteDescription;
      settings.contactEmail = req.body.contactEmail;
      settings.updatedAt = new Date();
      await settings.save();
    }
    res.redirect('/admin/settings');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Comments Management
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 });
    
    // Populate parent items
    const commentsWithParents = await Promise.all(
      comments.map(async (comment) => {
        let parentItem = null;
        if (comment.parentType === 'Achievement') {
          parentItem = await Achievement.findById(comment.parentId);
        } else if (comment.parentType === 'Philanthropic') {
          parentItem = await Philanthropic.findById(comment.parentId);
        }
        
        return {
          ...comment.toObject(),
          parentItem: parentItem
        };
      })
    );
    
    const stats = {
      total: comments.length,
      approved: comments.filter(c => c.approved).length,
      pending: comments.filter(c => !c.approved).length
    };

    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('admin/comments', { 
      layout: 'layouts/admin', 
      comments: commentsWithParents,
      stats,
      success,
      error
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.approveComment = async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { approved: true });
    res.redirect('/admin/comments?success=Comment approved');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/comments?error=Failed to approve comment');
  }
};

exports.unapproveComment = async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { approved: false });
    res.redirect('/admin/comments?success=Comment unapproved');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/comments?error=Failed to unapprove comment');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.redirect('/admin/comments?error=Comment not found');
    }

    // Delete image if exists
    if (comment.author.image && !comment.author.image.includes('dummy') && !comment.author.image.includes('/images/')) {
      await deleteImage(comment.author.image);
    }

    // If it's a reply, remove it from parent's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }

    // Delete all replies first
    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(req.params.id);
    
    res.redirect('/admin/comments?success=Comment deleted');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/comments?error=Failed to delete comment');
  }
};

