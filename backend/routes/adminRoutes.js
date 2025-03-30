//BASE URL: app.use('/admin', adminRoutes);

const express = require('express');
//IMPORT CONTROLLER METHODS
const {  deleteProductByID, updateProductByID, addProductInfo, registerAdmin, loginAdmin } = require('../controllers/adminController');
const protectAdmin = require('../middleware/protectAdmin');
const router = express.Router();


//Login/register
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);


//Get products by id
router.delete("/product/:productId", protectAdmin, deleteProductByID); 

router.put("/product/:editProductId", protectAdmin, updateProductByID);

router.post("/product", protectAdmin, addProductInfo);



module.exports = router;