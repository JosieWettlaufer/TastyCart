// Importing the User model to interact with the database
const { User, Product } = require('../models/User');
// Importing JWT for authentication and token generation
const jwt = require('jsonwebtoken');
// Importing bcrypt for hashing passwords
const bcrypt = require('bcryptjs');
// Load environment variables from .env file
require("dotenv").config();


// Register a new user
const registerUser = async (req, res) => {
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
    const user = await User.create({ username, email, password: hashedPassword });

    // Send success response after user is registered
    res.status(201).json({ message: "User registered successfully" });
};


// Login user and return JWT token
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Find user by username in the database
    const user = await User.findOne({ username });

    // Check if the user exists and if the provided password matches the hashed password
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
        {
             id: user._id,
             userId: user._id
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send the token and user details in the response
    res.json({ 
        token,
        user: { id: user._id, username: user.username, email: user.email }
    });
};

const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        res.json({
          message: `Welcome, user ${req.user.id}`,
          timers: user.timers, // Include the user's timers
        });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
}

//Get Product by Id
const getProductByID = async(req, res) => {
    const { productId } = req.params; //Get productId from URL 

    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found by controller' });
        }

        res.status(200).json({
            message: "Product found",
            product: product
        });
    } catch (error) {
        console.error("Error finding product:", error);
        res.status(500).json({ message: "Server error, failed to find product" });
    }
}

//Get product by category
const getProductByCategory = async (req, res) => {
    const { category } = req.query;
    
    try {
        // If no category provided, return all products
        if (!category) {
            const products = await Product.find({});
            return res.status(200).json({
                message: "All products retrieved",
                count: products.length,
                products
            });
        }
        
        // Find products matching the category
        const products = await Product.find({ category });
        
        if (products.length === 0) {
            return res.status(404).json({ 
                message: `No products found in category: ${category}` 
            });
        }
        
        res.status(200).json({
            message: `Products in category: ${category}`,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Error finding products by category:", error);
        res.status(500).json({ 
            message: "Server error, failed to retrieve products",
            error: error.message 
        });
    }
};

const postCart = async (req, res, next) => {
    try {
        // Try using req.userId which you explicitly set in the middleware
        const userId = req.userId || (req.user && req.user.id);
        
        if (!userId) {
        return res.status(401).json({ message: 'User ID not found' });
        }

        const product = req.body;

        // Find the user
        const user = await User.findById(userId);
                
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Initialize userCart if it doesn't exist
        if (!user.userCart) {
            user.userCart = { priceTotal: 0, products: [] };
        }

        // Add the product to the cart
        user.userCart.products.push(product);
        
        // Update the price total (assuming product has a price field)
        if (product.price) {
            user.userCart.priceTotal += product.price;
        }
        
        // Save the updated user document
        await user.save();

        res.status(200).json({
            message: 'product added to cart successfully',
            cart: user.userCart
        })
    } catch (err) {
        next(err);
    }
}

const getCartById = async (req, res, next) => {

    try {
        const userId = req.userId || (req.user && req.user.id);
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }
        
        // Find the user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: user.userCart
        });
    } catch(err) {
        next(err);
    }
}

const postCheckout = async(req, res, next) => {
    
}

// Exporting the register and login functions so they can be used in other parts of the application
module.exports = { registerUser, loginUser, getUser, getProductByID, getProductByCategory, postCart, getCartById,
    postCheckout
 };
