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
router.get("/product", getProductByCategory);

//CRUD Operations for user's cart
router.post("/cart", protectRoutes, postCart);
router.get("/cart", protectRoutes, getCartById);
router.delete("/cart/:itemId", protectRoutes, deleteCartItem);
router.patch("/cart/items/:itemId", protectRoutes, updateCartItem);

//Checkout
router.get("/orders", protectRoutes, getRecentOrder);

module.exports = router;
