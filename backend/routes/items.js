const express = require('express');
const router = require('express').Router();
const itemsController = require('../controllers/itemsController');
const authController = require('../controllers/authController'); // Import the auth controller

// Add a new item
router.post('/', authController.verifyToken, itemsController.addItem);

// Fetch items by subcategory
router.get('/bySubCategory', authController.verifyToken, itemsController.findBySubCategory);

// Fetch a single item by id
router.get('/:id', authController.verifyToken, itemsController.findOne);

// Fetch all items
router.get('/', authController.verifyToken, itemsController.findAll);

// Update an item by ID
router.put('/:id', authController.verifyToken, itemsController.update);

// Delete an item by ID
router.delete('/:id', authController.verifyToken, itemsController.delete);

router.route('/add').post(authController.verifyToken, itemsController.addItem);
module.exports = router;
