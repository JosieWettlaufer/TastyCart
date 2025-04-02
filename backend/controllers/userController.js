// Importing the User model to interact with the database
const { User, Product } = require('../models/User');
// Importing JWT for authentication and token generation
const jwt = require('jsonwebtoken');
// Importing bcrypt for hashing passwords
const bcrypt = require('bcryptjs');
// Load environment variables from .env file
require("dotenv").config();


//METHOD: Register a new user
const registerUser = async (req, res) => {
    //get credentials from request body
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

    //Save the new user in the database with hashed password
    const user = await User.create({ username, email, password: hashedPassword });

    // Send success response after user is registered
    res.status(201).json({ message: "User registered successfully" });
};


//METHOD: Login user and return JWT token
const loginUser = async (req, res) => {
    //get credentials from request body
    const { username, password } = req.body;

    try {
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
        console.error('login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};

//METHOD: Get Product by Id
const getProductByID = async(req, res) => {
    const { productId } = req.params; //Get productId from URL 

    try {
        //find product in database by productId
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found by controller' });
        }

        //success response with product
        res.status(200).json({
            message: "Product found",
            product: product
        });
    } catch (error) {
        //error response
        console.error("Error finding product:", error);
        res.status(500).json({ message: "Server error, failed to find product" });
    }
}

//METHOD: Get product by category
const getProductByCategory = async (req, res) => {
    //get category from URL
    const { category } = req.query;
    
    try {
        // If no category provided, return all products from database
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
        
        //If no products found, return error
        if (products.length === 0) {
            return res.status(404).json({ 
                message: `No products found in category: ${category}` 
            });
        }
        
        //success response with product count and list of products
        res.status(200).json({
            message: `Products in category: ${category}`,
            count: products.length,
            products
        });
    } catch (error) {
        //error response
        console.error("Error finding products by category:", error);
        res.status(500).json({ 
            message: "Server error, failed to retrieve products",
            error: error.message 
        });
    }
};

//METHOD: save user's cart to database
const postCart = async (req, res, next) => {
    try {
        // Get userId from authorization middleware
        const userId = req.userId;
        
        //check if userId exists
        if (!userId) {
        return res.status(401).json({ message: 'User ID not found' });
        }

        //get products from request body
        const product = req.body;

        // Find user in database
        const user = await User.findById(userId);
                
        //If not found, return error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Initialize userCart if it doesn't exist
        if (!user.userCart) {
            user.userCart = { priceTotal: 0, products: [] };
        }

        // Add the products to the user's cart
        user.userCart.products.push(product);
        
        // Update the price total for the cart
        if (product.price) {
            user.userCart.priceTotal += product.price;
        }
        
        // Save the updated user document
        await user.save();

        //return success message and user cart
        res.status(200).json({
            message: 'product added to cart successfully',
            cart: user.userCart
        })
    } catch (err) {
        next(err);
    }
}

//METHOD: get user's cart
const getCartById = async (req, res, next) => {

    try {
        //Get userId from authorization middleware
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }
        
        // Find user in the database
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        //Return success and user's cart
        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: user.userCart
        });
    } catch(err) {
        next(err);
    }
}

//METHOD: post checkout
const postCheckout = async(req, res, next) => {
    try {
        // Get user ID from request
        const userId = req.userId;
                
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        // Find the user
        const user = await User.findById(userId);
                
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Validate cart exists and is not empty
        if (!user.userCart || !user.userCart.products || user.userCart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or not found' });
        }

        // Get payment information from request body
        const { paymentMethod, shippingAddress } = req.body;
        
        if (!paymentMethod || !shippingAddress) {
            return res.status(400).json({ message: 'Payment information or shipping address missing' });
        }
        
        // Create order from cart
        const order = {
            user: userId,
            orderItems: user.userCart.products,
            shippingAddress,
            paymentMethod,
            totalPrice: user.userCart.priceTotal,
            isPaid: true,
            paidAt: Date.now()
        };
        
        // Add the order to the user's userOrders array
        user.userOrders.push(order);
        
        // Clear the user's cart after successful order
        user.userCart.products = [];
        user.userCart.priceTotal = 0;
        //Save user data to database
        await user.save();
        
        //return success and order
        res.status(201).json({
            message: 'Order created successfully',
            order: order
        });

    } catch (err) {
        next(err);
    }
};

//METHOD: Delete cart items
const deleteCartItem = async (req, res, next) => {
    try {
        // Get user ID from authentication middleware
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        // Get the item ID from the URL parameter
        const itemId = req.params.itemId;
        
        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }

        // Find the user and ensure they exist
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Make sure user has a cart
        if (!user.userCart || !user.userCart.products) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the item in the cart
        const itemIndex = user.userCart.products.findIndex(
            item => item._id.toString() === itemId
        );
        
        //If item does not exist return error
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Get the item price to subtract from total
        const itemPrice = user.userCart.products[itemIndex].price * 
                         (user.userCart.products[itemIndex].quantity || 1);

        // Remove the item from the products array
        user.userCart.products.splice(itemIndex, 1);
        
        // Update the cart total price
        user.userCart.priceTotal -= itemPrice;
        
        // Ensure price total doesn't go below zero
        if (user.userCart.priceTotal < 0) {
            user.userCart.priceTotal = 0;
        }
        
        // Save the updated user document
        await user.save();
        
        // Return success response with updated cart
        res.status(200).json({
            message: 'Item removed from cart successfully',
            cart: user.userCart
        });
        
    } catch (err) {
        console.error('Error removing item from cart:', err);
        next(err);
    }
};

//METHOD: Update Cart item
const updateCartItem = async (req, res, next) => {
    try {
        // Get user ID from authentication middleware
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        // Get the item ID from the URL parameter
        const itemId = req.params.itemId;
        
        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }

        // Get the new quantity from request body
        const { quantity } = req.body;
        
        //if quantity is undefined or below 1, return error
        if (quantity === undefined || quantity < 1) {
            return res.status(400).json({ 
                message: 'Valid quantity is required (must be at least 1)' 
            });
        }

        // Find the user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if cart exists
        if (!user.userCart || !user.userCart.products) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the item in the cart
        const itemIndex = user.userCart.products.findIndex(
            item => item._id.toString() === itemId
        );
        //If item does not exist return error
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Get the current item information
        const item = user.userCart.products[itemIndex];
        const oldQuantity = item.quantity || 1;
        const itemPrice = item.price;

        // Calculate the price difference due to quantity change
        const priceDifference = itemPrice * (quantity - oldQuantity);
        
        // Update the item quantity
        user.userCart.products[itemIndex].quantity = quantity;
        
        // Update the cart total price
        user.userCart.priceTotal += priceDifference;
        
        // Ensure price total doesn't go below zero
        if (user.userCart.priceTotal < 0) {
            user.userCart.priceTotal = 0;
        }
        
        // Save the updated user document
        await user.save();

        // Return the updated cart
        res.status(200).json({
            message: 'Cart item quantity updated successfully',
            cart: user.userCart
        });
        
    } catch (err) {
        console.error('Error updating cart item quantity:', err);
        next(err);
    }
};

//METHOD: Function for getting most recent
const getRecentOrder = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }
        
        // Find the user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //success response with last entry in the user's orders array
        res.status(200).json({
            message: 'Order retrieved successfully',
            order: user.userOrders[user.userOrders.length - 1]
        });
    } catch(err) {
        next(err);
    }
}

// Exporting the register and login functions so they can be used in other parts of the application
module.exports = { registerUser, loginUser, getProductByID, getProductByCategory, postCart, getCartById,
    postCheckout, deleteCartItem, updateCartItem, getRecentOrder
 };
