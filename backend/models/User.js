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

//Order model
const order = {
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [productSchema],
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true, default:0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: {type: Date}
};

//test cart
const cartSchema = new mongoose.Schema({
  priceTotal: { type: Number, required: true, default: 0}, 
  products: [productSchema] // array of product objects
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true},
  password: { type: String, required: true },
  userCart: cartSchema
});


// Create models
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const User = mongoose.model('User', userSchema);

// Export all models
module.exports = {
    Product,
    Cart,
    User
  };