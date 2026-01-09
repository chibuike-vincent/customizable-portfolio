const Admin = require('../models/Admin');

exports.getLogin = (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('admin/login', { error: 'Please provide both username and password' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    req.session.isAuthenticated = true;
    req.session.adminId = admin._id;
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.render('admin/login', { error: 'Server error. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/admin/login');
  });
};

