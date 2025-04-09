const express = require("express");
const {
  registerUser,
  loginUser,
  getProductByID,
  getProductByCategory,
  postCart,
  getCartById,
  deleteCartItem,
  updateCartItem,
  getRecentOrder,
} = require("../controllers/userController");
const protectRoutes = require("../middleware/protectRoutes");
const router = express.Router();


//Routes for user login/register
router.post("/login", loginUser);
router.post("/register", registerUser);

//Get products by id/category (eg. /product?category=cookie)
router.get("/product/:productId", getProductByID);
//Get all products
router.get("/product", getProductByCategory);

//Post products to user's cart
router.post("/cart", protectRoutes, postCart);
//Get user's cart
router.get("/cart", protectRoutes, getCartById);
//Delete items from user's cart using item id
router.delete("/cart/:itemId", protectRoutes, deleteCartItem);
//Update the quantity of a specific cart item
router.patch("/cart/items/:itemId", protectRoutes, updateCartItem);

//Checkout
router.get("/orders", protectRoutes, getRecentOrder);

module.exports = router;
