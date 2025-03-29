// Product controller with enhanced error handling
const { Product } = require('../models/User');  // Adjust path as needed

const deleteProductByID = async (req, res) => {
    try {
        // Get the product ID from the URL parameter
        const productId = req.params.productId;
        
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        
        // First try to find the product to see if it exists
        const productExists = await Product.findById(productId);
        
        if (!productExists) {
            console.log(`Product not found with ID: ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Try using deleteOne instead of findByIdAndDelete
        const result = await Product.deleteOne({ _id: productId });
        
        if (result.deletedCount === 0) {
            return res.status(500).json({ message: 'Failed to delete product' });
        }
        
        // Return success response
        return res.status(200).json({
            message: 'Product removed successfully',
            deletedProduct: productExists
        });
        
    } catch (err) {
        // Enhanced error logging
        console.error('Error removing product. Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        console.error('Stack trace:', err.stack);
        
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid product ID format',
                error: err.message 
            });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                error: err.message
            });
        }
        
        return res.status(500).json({ 
            message: 'Server error when deleting product',
            error: err.message
        });
    }
};

module.exports = { deleteProductByID };