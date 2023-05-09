const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const authController = require('../controllers/authController'); // Import the auth controller

router.post('/', authController.verifyToken, categoriesController.create);
router.get('/', authController.verifyToken, categoriesController.findAll);
router.put('/:id', authController.verifyToken, categoriesController.update);
router.delete('/:id', authController.verifyToken, categoriesController.delete);

module.exports = router;
