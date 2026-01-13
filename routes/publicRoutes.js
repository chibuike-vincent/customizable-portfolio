const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const upload = require('../config/multer');

router.get('/', publicController.getHome);
router.get('/profile', publicController.getProfile);
router.get('/achievements', publicController.getAchievements);
router.get('/philanthropic', publicController.getPhilanthropic);
router.get('/goodwill-messages', publicController.getGoodwillMessages);
router.post('/goodwill-messages', upload.single('image'), publicController.submitGoodwillMessage);
router.post('/comments', upload.single('image'), publicController.submitComment);

module.exports = router;

