const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

// Auth routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// Protected routes
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// Profile
router.get('/profile', isAuthenticated, adminController.getProfile);
router.post('/profile', isAuthenticated, upload.single('image'), adminController.updateProfile);

// Achievements
router.get('/achievements', isAuthenticated, adminController.getAchievements);
router.post('/achievements', isAuthenticated, upload.single('image'), adminController.createAchievement);
router.post('/achievements/:id', isAuthenticated, upload.single('image'), adminController.updateAchievement);
router.delete('/achievements/:id', isAuthenticated, adminController.deleteAchievement);

// Philanthropic
router.get('/philanthropic', isAuthenticated, adminController.getPhilanthropic);
router.post('/philanthropic', isAuthenticated, upload.array('images', 10), adminController.createPhilanthropic);
router.post('/philanthropic/:id', isAuthenticated, upload.array('images', 10), adminController.updatePhilanthropic);
router.delete('/philanthropic/:id', isAuthenticated, adminController.deletePhilanthropic);

// Messages
router.get('/messages', isAuthenticated, adminController.getMessages);
router.post('/messages/:id/verify', isAuthenticated, adminController.verifyMessage);
router.post('/messages/:id/unverify', isAuthenticated, adminController.unverifyMessage);
router.delete('/messages/:id', isAuthenticated, adminController.deleteMessage);
// Direct POST route for delete (simpler than method-override)
router.post('/messages/:id/delete', isAuthenticated, adminController.deleteMessage);

// Settings
router.get('/settings', isAuthenticated, adminController.getSettings);
router.post('/settings', isAuthenticated, adminController.updateSettings);

module.exports = router;

