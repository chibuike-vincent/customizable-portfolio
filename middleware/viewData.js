const Profile = require('../models/Profile');
const Settings = require('../models/Settings');

const attachViewData = async (req, res, next) => {
  try {
    const [profile, settings] = await Promise.all([
      Profile.findOne(),
      Settings.getSettings()
    ]);

    res.locals.profile = profile || {};
    res.locals.settings = settings || {};
    next();
  } catch (error) {
    console.error('Error attaching view data:', error);
    res.locals.profile = {};
    res.locals.settings = {};
    next();
  }
};

module.exports = attachViewData;

