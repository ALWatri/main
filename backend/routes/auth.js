const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtSecret = process.env.JWT_SECRET;

router.post('/signup', (req, res) => authController.signup(req, res, jwtSecret));
router.post('/login', (req, res) => authController.login(req, res, jwtSecret));
router.post('/send-reset-password-email', (req, res) => authController.sendResetPasswordEmail(req, res, jwtSecret));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res, jwtSecret));

router.use(authController.verifyToken);

module.exports = router;
