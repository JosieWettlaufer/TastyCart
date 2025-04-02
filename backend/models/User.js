const mongoose = require("mongoose");

//Product Schema
const productSchema = new mongoose.Schema({
  image: {type: String},
  productName: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  description: { type: String, default: 'A delicious treat!' },
  quantity: { type: Number, required: true, default: 0},
  category: { type: String, default: 'cookie' }
});

//Cart Schema
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

//User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "User"},
  email: { type: String, required: true},
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