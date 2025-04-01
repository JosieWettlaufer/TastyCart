//BASE URL: app.use('/admin', adminRoutes);

const express = require('express');
//IMPORT CONTROLLER METHODS
const {  deleteProductByID, updateProductByID, addProductInfo, registerAdmin, loginAdmin } = require('../controllers/adminController');
const protectRoutes = require('../middleware/protectRoutes');
const router = express.Router();


//Login/register
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);


//Get products by id
router.delete("/product/:productId", protectRoutes, deleteProductByID); 

router.put("/product/:editProductId", protectRoutes, updateProductByID);

router.post("/product", protectRoutes, addProductInfo);



module.exports = router;