const Profile = require('../models/Profile');
const Achievement = require('../models/Achievement');
const Philanthropic = require('../models/Philanthropic');
const GoodwillMessage = require('../models/GoodwillMessage');
const Settings = require('../models/Settings');
const Comment = require('../models/Comment');

exports.getHome = async (req, res) => {
  try {
    const [profile, achievements, philanthropic, messages, settings] = await Promise.all([
      Profile.findOne(),
      Achievement.find().sort({ date: -1 }).limit(3),
      Philanthropic.find().sort({ date: -1 }).limit(3),
      GoodwillMessage.find({ verified: true }).sort({ createdAt: -1 }).limit(6),
      Settings.getSettings()
    ]);

    res.render('public/home', {
      layout: 'layouts/main',
      profile: profile || {},
      achievements: achievements || [],
      philanthropic: philanthropic || [],
      messages: messages || [],
      settings: settings || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [profile, settings] = await Promise.all([
      Profile.findOne(),
      Settings.getSettings()
    ]);

    res.render('public/profile', {
      layout: 'layouts/main',
      profile: profile || {},
      settings: settings || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    const settings = await Settings.getSettings();
    
    // Get approved comments for each achievement
    const achievementsWithComments = await Promise.all(
      achievements.map(async (achievement) => {
        const topLevelComments = await Comment.find({
          parentType: 'Achievement',
          parentId: achievement._id,
          approved: true,
          parentComment: null // Only top-level comments
        }).sort({ createdAt: -1 });
        
        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
          topLevelComments.map(async (comment) => {
            const replies = await Comment.find({
              parentComment: comment._id,
              approved: true
            }).sort({ createdAt: 1 });
            
            return {
              ...comment.toObject(),
              replies: replies || []
            };
          })
        );
        
        return {
          ...achievement.toObject(),
          comments: commentsWithReplies || []
        };
      })
    );

    res.render('public/achievements', {
      layout: 'layouts/main',
      achievements: achievementsWithComments || [],
      settings: settings || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getPhilanthropic = async (req, res) => {
  try {
    const philanthropic = await Philanthropic.find().sort({ date: -1 });
    const settings = await Settings.getSettings();
    
    // Get approved comments for each philanthropic item
    const philanthropicWithComments = await Promise.all(
      philanthropic.map(async (item) => {
        const topLevelComments = await Comment.find({
          parentType: 'Philanthropic',
          parentId: item._id,
          approved: true,
          parentComment: null // Only top-level comments
        }).sort({ createdAt: -1 });
        
        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
          topLevelComments.map(async (comment) => {
            const replies = await Comment.find({
              parentComment: comment._id,
              approved: true
            }).sort({ createdAt: 1 });
            
            return {
              ...comment.toObject(),
              replies: replies || []
            };
          })
        );
        
        return {
          ...item.toObject(),
          comments: commentsWithReplies || []
        };
      })
    );

    res.render('public/philanthropic', {
      layout: 'layouts/main',
      philanthropic: philanthropicWithComments || [],
      settings: settings || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getGoodwillMessages = async (req, res) => {
  try {
    const [messages, settings] = await Promise.all([
      GoodwillMessage.find({ verified: true }).sort({ createdAt: -1 }),
      Settings.getSettings()
    ]);

    res.render('public/goodwill-messages', {
      layout: 'layouts/main',
      messages: messages || [],
      settings: settings || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.submitGoodwillMessage = async (req, res) => {
  try {
    const messageData = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    };

    if (req.file) {
      // Cloudinary returns the URL in req.file.path
      messageData.image = req.file.path;
    }

    await GoodwillMessage.create(messageData);
    res.redirect('/goodwill-messages?success=true');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Comment functions
exports.submitComment = async (req, res) => {
  try {
    const { name, email, content, parentType, parentId, parentComment } = req.body;

    if (!name || !email || !content || !parentType || !parentId) {
      return res.redirect('back?error=Please fill in all required fields');
    }

    const commentData = {
      content: content.trim(),
      author: {
        name: name.trim(),
        email: email.toLowerCase().trim()
      },
      parentType: parentType,
      parentId: parentId,
      approved: false // Requires admin approval
    };

    if (req.file) {
      commentData.author.image = req.file.path;
    }

    // If this is a reply to another comment
    if (parentComment) {
      commentData.parentComment = parentComment;
    }

    const comment = await Comment.create(commentData);

    // If it's a reply, add it to the parent comment's replies array
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      });
    }

    const redirectPath = parentType === 'Achievement' 
      ? '/achievements?comment=submitted' 
      : '/philanthropic?comment=submitted';
    
    res.redirect(redirectPath);
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.redirect('back?error=Failed to submit comment');
  }
};

