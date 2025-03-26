//could also be used for admin
const mongoose = require("mongoose");

//test products
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  description: { type: String, default: 'A delicious treat!' },
  quantity: { type: Number, required: true, default: 0},
  category: { type: String, default: 'cookie' }
});

//test cart
const cartSchema = new mongoose.Schema({
  priceTotal: { type: Number, required: true, default: 0}, 
  products: [productSchema] // array of product objects
});

//Order model
const orderSchema = new mongoose.Schema ({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: cartSchema,
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true, default:0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: {type: Date}
});




const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true},
  password: { type: String, required: true },
  userCart: cartSchema,
  userOrders: [orderSchema]
});


// Create models
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);
const User = mongoose.model('User', userSchema);

// Export all models
module.exports = {
    Product,
    Order,
    Cart,
    User
  };