const express = require('express');
//IMPORT CONTROLLER METHODS
const { registerUser, loginUser, getUser, getProductByID, getProductByCategory, postCart, getCartById, postCheckout,
    deleteCartItem, updateCartItem, createOrder } = require('../controllers/userController');
const protect = require('../middleware/protect');
const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);

//Get products by id
router.get("/product/:productId", getProductByID);
//Get products by catgory (eg. /product?category=cookie)
router.get("/product", getProductByCategory);

//Add items to cart
router.post('/cart', protect, postCart);
//Get cart all cart items for user 
router.get('/cart', protect, getCartById);
//delete Cart items
router.delete('/cart/:itemId', protect, deleteCartItem)
//update cart item
router.patch('/cart/items/:itemId', protect, updateCartItem);

//Checkout
router.post('/orders', protect, createOrder);

/*

//display confirmation page, pass username, possibly order summary
router.get("confirmation{userID}")
*/
module.exports = router;