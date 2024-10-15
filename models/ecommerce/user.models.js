import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
},
)

export const User = mongoose.model("User" , userSchema);