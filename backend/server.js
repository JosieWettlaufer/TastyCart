const dotenv = require("dotenv");
const express = require("express");
const connectDB = require('./config/db');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes2');
const adminRoutes = require('./routes/adminRoutes');
const stripeRoutes = require('./routes/stripeRoutes.js')


dotenv.config();
connectDB();

const app = express();
//access static files from public directory
app.use(express.static('public'));
//Parse incoming JSON req bodies
app.use(express.json());
//Enable CORS from localhost:3000 (for react frontend)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
//middleware to parse cookies from incoming requests
app.use(cookieParser());


//use auth routes defined in authRoutes.js file
app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', stripeRoutes);

const PORT = process.env.PORT || 5690;

//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));