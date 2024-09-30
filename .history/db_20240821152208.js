import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/todos/user.models.js"; // Make sure your export/import is consistent

dotenv.config();
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
});

app.post("/createuser", async (req, res) => {
    try {
        // Use request body instead of hardcoded values
        const data = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // Save the data
        await data.save();

        return res.status(200).json({ message: "User has been created successfully" });
    } catch (error) {
        // Catch and handle any errors
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.listen(8200, () => {
    console.log("Server is running on port 8200");
});
