import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Product } from "./models/ecommerce/product.models.js"; // Adjust the path if necessary
import { User } from "./models/ecommerce/user.models.js"; // Assuming you have a User model defined
import { Wishlist } from "./models/ecommerce/Wishlist.models.js"; // Assuming you have a User model defined
import { Cart } from "./models/ecommerce/cart.models.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
dotenv.config();
const app = express();
const jwtKEYS = process.env.JWT_SECRET || "default-secret";

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, jwtKEYS, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Routes
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "rahulwap420@gmail.com",
    pass: "nkca kqrv tsdw sgeu",
  },
});
const SendEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <rahulwap420@gmail.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log('Email sent: ', info.messageId); // Logs the message ID upon successful email sending
  } catch (error) {
    console.error('Error sending email:', error); // Logs any error that occurs during email sending
  }
};

// Call the function to send the email
SendEmail();


// Create a new user
app.post('/createuser',async (req, res) => {
  try {
    const { email, password  , otp } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and set expiry (e.g., 10 minutes from now)
    const verificationCode = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiry,
    });
    await newUser.save();

    // Send the OTP via email
    const mailOptions = {
      from: '"appmail" <rahulwap420@gmail.com>',
      to: newUser.email,
      subject: 'Your OTP for Email Verification',
      text: `Your OTP is ${verificationCode}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: 'User created successfully. Please check your email for the OTP.',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
//verify otp

app.post("/otpverification", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (user.verificationCode === otp) {
      // Update user's verification status
      await User.updateOne(
        { email },
        { $set: { isVerified: true, verificationCode: null } }
      );

      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
if(user.isVerified){
   const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove the password from the user object
    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = jwt.sign({ userId: user._id }, jwtKEYS, { expiresIn: "4h" });
    return res.status(200).json({ message: "Login successful", token: token, data: userWithoutPassword });
}
return res.status(401).json({ message: "Please verify your mail" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// Protected route to get all users
app.get("/getuser", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

app.get("/getproducts", async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

// Get all products with optional filters
app.get("/getproductbyid/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const products = await Product.findOne({ _id: req.params.id });
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

// Create a new product
app.post("/products", async (req, res) => {
  try {
    const {
      title,
      price,
      stock,
      category,
      category_details,
      color,
      image,
      size,
    } = req.body;

    const newProduct = new Product({
      title,
      price,
      stock,
      category,
      category_details,
      color,
      size,
      image,
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

// Wishlist APIs

// Add product to wishlist
app.post("/createwishlist",  async (req, res) => {
  try {
    //product-details

    const { product_id , user_id } = await req.body;
    const data = await JSON.parse(user_id)
    const userId = data?.data._id;
    if (!product_id) return res.status(400).json("Please provide product id");
    //amansir sir current login user
    // const user_id = "66f39b8bb45f445b1af4d178";
    const wishlist = await Wishlist.findOne({ userId: userId });
    if (wishlist) {
      wishlist.items.push(product_id);
      await wishlist.save();
    } else {
      const newWishlist = new Wishlist({
        userId: userId,
        items: [product_id],
      });
      await newWishlist.save();
    }

    return res.status(201).json({ message: "Product added to wishlist" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error adding product to wishlist",
        error: error.message,
      });
  }
});

app.get("/wishlist", async (req, res) => {
  try {
    const userId = "66f39b8bb45f445b1af4d178"; // You can get this from req.user or req.params dynamically.

    // Fetch the wishlist and populate product details
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items",
      select: "title price image", // Specify which fields to return
    });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Return the wishlist with populated product details
    return res.status(200).json(wishlist);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching wishlist", error: error.message });
  }
});

// cart api's
// Create or update cart
app.post("/createcart", async (req, res) => {
  try {
    // Extract product details from the request body
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json("Please provide product id");

    // Current logged-in user (hardcoded for now)
    const user_id = "66f39b8bb45f445b1af4d178";
    const cart = await Cart.findOne({ userId: user_id });

    // If the cart exists, add the product to the cart items
    if (cart) {
      cart.items.push(product_id);
      await cart.save();
    } else {
      // Create a new cart if it doesn't exist
      const newCart = new Cart({
        userId: user_id,
        items: [product_id],
      });
      await newCart.save();
    }

    return res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding product to cart", error: error.message });
  }
});

// Get cart details
app.get("/getallcart", async (req, res) => {
  try {
    // Current logged-in user (hardcoded for now)
    const userId = "66f39b8bb45f445b1af4d178";

    // Fetch the cart and populate product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      select: "title price image", // Specify which fields to return
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Return the cart with populated product details
    return res.status(200).json(cart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

// Delete a product from cart
app.delete("/deletecart", async (req, res) => {
  try {
    // Extract product ID from the request body
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json("Please provide product id");

    // Current logged-in user (hardcoded for now)
    const user_id = "66f39b8bb45f445b1af4d178";

    // Find the user's cart
    const cart = await Cart.findOne({ userId: user_id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart items
    cart.items = cart.items.filter(item => item.toString() !== product_id);

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing product from cart", error: error.message });
  }
});


// Remove product from wishlist

app.delete("/deletewishlist", async (req, res) => {
  try {
    // Extracting product ID from the request body
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json("Please provide product id");

    // Assuming Aman Sir is the current logged-in user
    const user_id = "66f39b8bb45f445b1af4d178";

    // Finding the wishlist of the user
    const wishlist = await Wishlist.findOne({ userId: user_id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Removing the product from the wishlist items
    const itemIndex = wishlist.items.indexOf(product_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error removing product from wishlist",
        error: error.message,
      });
  }
});

app.listen(8201, () => {
  console.log("Server is running on port 8201");
});





