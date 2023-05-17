const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.post('/', /*authController.verifyToken,*/ usersController.create);
router.get('/', authController.verifyToken, usersController.findAll);
router.put('/:id', authController.verifyToken, usersController.update);
router.delete('/:id', authController.verifyToken, usersController.delete);
router.post('/login', authController.login);
router.get('/wishlist', authController.verifyToken, usersController.getWishlist);
router.post('/:userId/wishlist/:itemId', authController.verifyToken, usersController.addItemToWishlist);
router.post('/:userId/wishlist/remove/:itemId', authController.verifyToken, usersController.removeItemFromWishlist);



module.exports = router;
