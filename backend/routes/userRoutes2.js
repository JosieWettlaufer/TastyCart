const express = require('express');
//IMPORT CONTROLLER METHODS
const { registerUser, loginUser, getUser, getProductByID, getProductByCategory, postCart, getCartById, postCheckout, getOrders } = require('../controllers/userController');
const protect = require('../middleware/protect');
const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);

//Get products by id
router.get("/product/:productId", getProductByID);
//Get products by catgory (eg. /product?category=cookie)
router.get("/product", getProductByCategory);

/*
//usure (add product to cart)
router.post("/product", protect, addProduct)
//delete product from cart
router.delete("/product{Id}", protect, removeProduct)
//update product quantity from cart
router.update("/product{Id}", protect, removeProduct)
*/

//Add items to cart
router.post('/cart', protect, postCart);
//Get cart items
router.get('/cart/:cartId', protect, getCartById);

//Checkout
router.post('/cart/:cartId/checkout', protect, postCheckout)


router.get('/orders', protect, getOrders);
/*

//display confirmation page, pass username, possibly order summary
router.get("confirmation{userID}")
*/
module.exports = router;