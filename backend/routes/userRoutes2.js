const express = require('express');
//IMPORT CONTROLLER METHODS
const { registerUser, loginUser, getProductByID, getProductByCategory, postCart, getCartById,
    deleteCartItem, updateCartItem, getRecentOrder } = require('../controllers/userController');
const protectRoutes = require('../middleware/protectRoutes');
const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);

//Get products by id
router.get("/product/:productId", getProductByID);
//Get products by catgory (eg. /product?category=cookie)
router.get("/product", getProductByCategory);

//Add items to cart
router.post('/cart', protectRoutes, postCart);
//Get cart all cart items for user 
router.get('/cart', protectRoutes, getCartById);
//delete Cart items
router.delete('/cart/:itemId', protectRoutes, deleteCartItem)
//update cart item
router.patch('/cart/items/:itemId', protectRoutes, updateCartItem);

//Checkout
router.get('/orders', protectRoutes, getRecentOrder);

module.exports = router;