const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const protectRoutes = require('../middleware/protectRoutes');
const { User } = require('../models/User'); // Add this import
//stripe + client test secret key
const stripe = require('stripe')('sk_test_51R6n86KbzkDbosBfleOqPMx3aUTzQMldA8IqvuSOBKkhb0s0f0CV8axkLXoyYFyVlpl5JmupjyBi0Uq82pLK7a3q00hlx18kvk');
require('dotenv');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Store these in environment variables
        pass: process.env.EMAIL_PASS
    }
});

async function sendOrderConfirmation (customerOrder, customerEmail) {

    // Generate the list items HTML
    const itemsListHtml = customerOrder.orderItems.products.map(item => 
        `<li>
           ${item.productName || "Product"} - $${(item.price || 0).toFixed(2)}
           ${item.quantity > 1 ? ` (Qty: ${item.quantity})` : ""}
         </li>`
    ).join(''); // Join the array into a string

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>

        <p>Date: ${new Date(customerOrder.paidAt).toLocaleDateString()}</p>
        
        <h3>Order Summary:</h3>
        <p>Total: $${customerOrder.totalPrice.toFixed(2)}</p>
        
        <p>Shipping Address: ${customerOrder.shippingAddress || 'Not provided'}</p>

        <p>Order Items:</p> 
                <ul>
                    ${itemsListHtml}
                </ul>
        
        <p>If you have any questions, please contact our customer service team.</p>
    </div>
`;
    
    //send mail w/ defined transport object
    const info = await transporter.sendMail({
        from: '"TastyCart" <tastycart2025@gmail.com>',

        //sender address
        to: customerEmail,
        subject: "Order Confirmation",
        text: `Thank you for your purchase! Please keep this email for your records until the order arrives.`,
        html: html
    });

    
    console.log("Message sent: %s", info.messageId);
    return info;
}

//Stripe api calls
router.post('/create-checkout-session', protectRoutes, async (req, res) => {
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
      return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: {enabled: true},
      shipping_address_collection: {
        allowed_countries: ['CA'], // Add countries you want to allow
      },
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
  
router.get('/session-status', async (req, res) => {
    try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    let orderData = null;
  
    // If payment is successful, create an order and clear the cart
    if (session.status === 'complete' && session.metadata && session.metadata.userId) {
        try {
            const userId = session.metadata.userId;
            const user = await User.findById(userId);
            
            if (user && user.userCart) {
                // Create new order
                const newOrder = {
                    user: userId,
                    orderItems: user.userCart,
                    shippingAddress: session.shipping_details?.address?.line1 || 'Not provided',
                    paymentMethod: 'Stripe',
                    totalPrice: session.amount_total / 100, // Convert from cents
                    isPaid: true,
                    paidAt: new Date()
                };
                
                // Add order to user's orders
                user.userOrders.push(newOrder);

                orderData = newOrder;
                
                // Clear the cart
                user.userCart = { priceTotal: 0, products: [] };
                
                // Save changes
                await user.save();

                // Send confirmation email
                try {
                    await sendOrderConfirmation(newOrder, session.customer_details.email);
                } catch (emailError) {
                    console.error('Failed to send confirmation email:', emailError);
                }
            }
        } catch (err) {
            console.error('Error creating order after payment:', err);
                        // We still return success to the client since payment succeeded
                        // but log the error for debugging
        }
  }

  res.send({
    status: session.status,
    customer_email: session.customer_details ? session.customer_details.email : '',
    order: orderData
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ message: 'Failed to retrieve session status', error: error.message });
    }
});

module.exports = router;