//BASE URL: app.use('/admin', adminRoutes);

const express = require('express');
//IMPORT CONTROLLER METHODS
const {  deleteProductByID, updateProductByID } = require('../controllers/adminController');
const protect = require('../middleware/protect');
const router = express.Router();



//Get products by id
router.delete("/product/:productId", deleteProductByID); //ADD middleware!!!

router.put("/product/:editProductId", updateProductByID);




module.exports = router;