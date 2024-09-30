import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Product } from './models/ecommerce/product.models.js'; // Adjust the path if necessary
import { User } from './models/ecommerce/user.models.js'; // Assuming you have a User model defined
import { Wishlist } from './models/ecommerce/Wishlist.models.js'; // Assuming you have a User model defined
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
  const token = req.headers['authorization'];
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

// Create a new user
app.post('/createuser', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, jwtKEYS, { expiresIn: '4h' });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Protected route to get all users
app.get('/getuser', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get('/getproducts', async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});


// Get all products with optional filters
app.get('/getproductbyid/:id', async (req, res) => {

  console.log(req.params.id)

  try {
    const products = await Product.findOne({"_id":req.params.id});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const { title, price, stock, category, category_details, color, image, size } = req.body;

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
    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

// Wishlist APIs

// Add product to wishlist
app.post('/createwishlist', async (req, res) => {
  try {
    //product-details

    const {product_id} = await  req.body;
    if(!product_id) return res.status(400).json("Please provide product id")
    //amansir sir current login user
    const user_id = "66f39b8bb45f445b1af4d178";
    const wishlist = await Wishlist.findOne({ userId: user_id });
    if (wishlist) {
      wishlist.items.push(product_id);
      await wishlist.save();
    } else {
      const newWishlist = new Wishlist({
        userId: user_id,
        items: [product_id],
      });
      await newWishlist.save();
    }

    return res.status(201).json({ message: "Product added to wishlist" });
  } catch (error) {
    return res.status(500).json({ message: "Error adding product to wishlist", error: error.message });
  }
});






// Get user's wishlist
// app.get('/wishlist', async (req, res) => {
//   try {
//     const userId = "66f39b8bb45f445b1af4d178"; // You may want to get this dynamically, e.g., from req.user or req.params.

//     // Fetch the wishlist and populate product details directly
//     const wishlist = await Wishlist.findOne({ userId }).populate('items._id', 'title price image');

//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     // Return the wishlist with populated product details
//     return res.status(200).json(wishlist);
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching wishlist", error: error.message });
//   }
// });


app.get('/wishlist', async (req, res) => {
  try {
      const userId = "66f39b8bb45f445b1af4d178"; // You can get this from req.user or req.params dynamically.

      // Fetch the wishlist and populate product details
      const wishlist = await Wishlist.findOne({ userId })
          .populate({
              path: 'items',
              select: 'title price image', // Specify which fields to return
          });

      if (!wishlist) {
          return res.status(404).json({ message: "Wishlist not found" });
      }

      // Return the wishlist with populated product details
      return res.status(200).json(wishlist);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
});


// Remove product from wishlist
app.delete('/wishlist/:productId',  async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    await wishlist.save();

    return res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing product from wishlist", error: error.message });
  }
});

// Start the server
app.listen(8201, () => {
  console.log("Server is running on port 8201");
});
