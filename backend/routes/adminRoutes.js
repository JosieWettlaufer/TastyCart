const express = require('express');
const {  deleteProductByID, updateProductByID, addProductInfo, registerAdmin, loginAdmin } = require('../controllers/adminController');
const protectRoutes = require('../middleware/protectRoutes');
const router = express.Router();


//BASE URL: app.use('/admin', adminRoutes);


//Login/register
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);


//CRUD Operations for products (except read)
router.delete("/product/:productId", protectRoutes, deleteProductByID); 
router.put("/product/:editProductId", protectRoutes, updateProductByID);
router.post("/product", protectRoutes, addProductInfo);


module.exports = router;