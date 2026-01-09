const Profile = require('../models/Profile');
const Achievement = require('../models/Achievement');
const Philanthropic = require('../models/Philanthropic');
const GoodwillMessage = require('../models/GoodwillMessage');
const Settings = require('../models/Settings');

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
    const [achievements, settings] = await Promise.all([
      Achievement.find().sort({ date: -1 }),
      Settings.getSettings()
    ]);

    res.render('public/achievements', {
      layout: 'layouts/main',
      achievements: achievements || [],
      settings: settings || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getPhilanthropic = async (req, res) => {
  try {
    const [philanthropic, settings] = await Promise.all([
      Philanthropic.find().sort({ date: -1 }),
      Settings.getSettings()
    ]);

    res.render('public/philanthropic', {
      layout: 'layouts/main',
      philanthropic: philanthropic || [],
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

