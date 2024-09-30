import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";  // For password hashing and comparison
import { User } from "./models/todos/user.models.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
});

// Create User Endpoint
app.post("/createuser", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,  // Save the hashed password
        });

        // Save the user to the database
        await newUser.save();

        return res.status(200).json({ message: "User has been created successfully" });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login Endpoint
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // If the password is correct, return success message (you can also generate tokens if needed)
        return res.status(200).json({ message: "Login successful", user: existingUser });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get All Users Endpoint
app.get("/getuser", async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Start the server
app.listen(8200, () => {
    console.log("Server is running on port 8200");
});
