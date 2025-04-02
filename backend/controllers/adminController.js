// Product controller with enhanced error handling
const { User, Product } = require('../models/User');
// Importing JWT for authentication and token generation
const jwt = require('jsonwebtoken');
// Importing bcrypt for hashing passwords
const bcrypt = require('bcryptjs');
// Load environment variables from .env file
require("dotenv").config();


//METHOD: Register a new user
const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a user with the same username or email already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        return res.status(400).json({ message: "Username or Email already exists" });
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create and save the new user in the database
    const user = await User.create({ username, email, password: hashedPassword, role: "admin" });

    // Send success response after user is registered
    res.status(201).json({ message: "Admin created registered successfully" });
};

//METHOD: Deletes a specific product from the database
const deleteProductByID = async (req, res) => {
    try {
        // Get the product ID from the URL parameter
        const productId = req.params.productId;
        
        //If no product id, returns error
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        
        // Try to find the product to see if it exists
        const productExists = await Product.findById(productId);

        if (!productExists) {
            console.log(`Product not found with ID: ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Delete Product from database
        const result = await Product.deleteOne({ _id: productId });
        
        //Return error if deletion fails
        if (result.deletedCount === 0) {
            return res.status(500).json({ message: 'Failed to delete product' });
        }
        
        // Return success response
        return res.status(200).json({
            message: 'Product removed successfully',
            deletedProduct: productExists
        });
        
    } catch (err) {
        
        //Return custom error message based on error name
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

//METHOD: Update a product by ID
const updateProductByID = async (req, res) => {
    try {
        // Get the product ID from URL parameter
        const productId = req.params.editProductId;

        //return error if productId not found
        if (!productId) {
            console.log("Product ID missing in request");
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Get updated product data from request body
        const { image, productName, price, description, quantity, category } = req.body;

        //Shorten image URL
        const shortImgUrl = image.split('/')[image.split('/').length - 1];

        
        // Create update object with the provided fields
        const updateData = {};
        if (image) updateData.image = shortImgUrl;
        if (productName) updateData.productName = productName;
        if (price !== undefined) updateData.price = price;
        if (description !== undefined) updateData.description = description;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (category) updateData.category = category;
        
        console.log("Final update data to be applied:", updateData);

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true } // Return the updated document
        );
        
        //Return error message if update fails
        if (!updatedProduct) {
            console.log("Product not found with ID:", productId);
            return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log("Product updated successfully:", updatedProduct);
        
        // Return success response
        return res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
        
    } catch (err) {
        
        //Return custom error message based on error name
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        
        return res.status(500).json({ 
            message: 'Server error when updating product',
            error: err.message 
        });
    }
};

//METHOD: Add new product to database
const addProductInfo = async(req, res) => {

    try {
        //get product details from request body
        const { productName, price, description, quantity, category } = req.body;

        //If image added shorten image URL
        const image = req.body.image ? req.body.image.split('/')[req.body.image.split('/').length - 1] : null;

        //Create new product with updated request body attributes
        const product = new Product({ image, productName, price, description, quantity, category });

        //save product to database
        await product.save();

        //Success response
        res.status(201).json({
            message: 'Product added successfully',
            product: product
        });
    } catch (error) {
        //error response
        res.status(400).json({ message: error.message });
    }
}

//METHOD: Login Admin and return JWT token
const loginAdmin = async (req, res) => {
    //get credentials from req body
    const { username, password } = req.body;

    try {
        // Find user by username in the database
        const user = await User.findOne({ username });

        // Check if the user exists and if the provided password matches the hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //Check if user has required admin role
        if (user.role !== "admin") {
            return res.status(400).json({ message: "Invalid role" })
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send the token and user details in the response
        res.json({ 
            token,
            user: {
                id: user._id, 
                username: user.username, 
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        //error response
        console.error('login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};


module.exports = { deleteProductByID, updateProductByID, addProductInfo, registerAdmin, loginAdmin };