import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({},{Timestamp: true})


export const User = mongoose.model("User" , userSchema)