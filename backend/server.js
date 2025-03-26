const protect = require('./middleware/protect.js');
const { User } = require('./models/User'); // Adjust the path as needed

const dotenv = require("dotenv");
const express = require("express");
const connectDB = require('./config/db');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes2');
//stripe + client test secret key
const stripe = require('stripe')('sk_test_51R6n86KbzkDbosBfleOqPMx3aUTzQMldA8IqvuSOBKkhb0s0f0CV8axkLXoyYFyVlpl5JmupjyBi0Uq82pLK7a3q00hlx18kvk');

dotenv.config();
connectDB();

const app = express();
//access static files from public directory
app.use(express.static('public'));
//Parse incoming JSON req bodies
app.use(express.json());
//Enable CORS from localhost:3000 (for react frontend)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
//middleware to parse cookies from incoming requests
app.use(cookieParser());

const YOUR_DOMAIN = 'http://localhost:3000';


//Stripe api calls
app.post('/create-checkout-session', protect, async (req, res) => {
    try {
        //get userId and auth middleware
        const userId = req.userId || (req.user && req.user.id);

        if(!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const user = await User.findById(userId);

        if (!user || !user.userCart || !user.userCart.products || user.userCart.products.length === 0) {
            return res.status(404).json({ message: 'User cart is empty or not found' });
        }

        //Create line items from user's cart
        const lineItems = user.userCart.products.map(product => ({
            price_data: {
                currency: 'cad',
                product_data: {
                    name: product.productName || 'Product',
                    description: product.description || '',
                },
                unit_amount: Math.round((product.price || 0) * 100), //convert to cents
            },
            quantity: product.quantity || 1,
        }));
    
        //Create checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: {enabled: true},
      //Store user ID in metadata for reference
      metadata: {
        userId: userId.toString()
      }
    });
  
    res.send({clientSecret: session.client_secret});
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
});
  
  app.get('/session-status', async (req, res) => {
    try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  
    // If payment is successful, create an order and clear the cart
    if (session.status === 'complete' && session.metadata && session.metadata.userId) {
        try {
            const userId = session.metadata.userId;
            const user = await User.findById(userId);
            
            if (user && user.userCart) {
                // Create new order
                const newOrder = {
                    user: userId,
                    email: user.email,
                    orderItems: user.userCart,
                    shippingAddress: session.shipping ? session.shipping.address.line1 : 'Not provided',
                    paymentMethod: 'Stripe',
                    totalPrice: session.amount_total / 100, // Convert from cents
                    isPaid: true,
                    paidAt: new Date()
                };
                
                // Add order to user's orders
                user.userOrders.push(newOrder);
                
                // Clear the cart
                user.userCart = { priceTotal: 0, products: [] };
                
                // Save changes
                await user.save();
            }
        } catch (err) {
            console.error('Error creating order after payment:', err);
                        // We still return success to the client since payment succeeded
                        // but log the error for debugging
        }
  }

  res.send({
    status: session.status,
    customer_email: session.customer_details ? session.customer_details.email : ''
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ message: 'Failed to retrieve session status', error: error.message });
    }
});

//use auth routes defined in authRoutes.js file
app.use('/', userRoutes);

const PORT = process.env.PORT || 5690;

//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));