import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/todos/user.models.js";

dotenv.config();
const app = express();


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

        const { username, email, password } = req.body;


        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        // const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        // if (existingUser) {
        //     return res.status(400).json({ message: "Username or Email already exists" });
        // }


        const newUser = new User({
            username,
            email,
            password
        });


        await newUser.save();


        return res.status(200).json({ message: "User has been created successfully" });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.listen(8200, () => {
    console.log("Server is running on port 8200");
});
