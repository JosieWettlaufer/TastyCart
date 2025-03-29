//BASE URL: app.use('/admin', adminRoutes);

const express = require('express');
//IMPORT CONTROLLER METHODS
const {  deleteProductByID } = require('../controllers/adminController');
const protect = require('../middleware/protect');
const router = express.Router();



//Get products by id
router.delete("/product/:productId", deleteProductByID); //SOME KIND OF AUTH MIDDLWARE?



module.exports = router;