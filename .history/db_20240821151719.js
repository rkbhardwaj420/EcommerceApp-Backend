import express from "express";
import dotenv  from "dotenv";
import mongoose from "mongoose";
import User from "./models/todos/user.models.js"
dotenv.config();
const app = express();


mongoose.connect(process.env.MONGODB).then(()=>{
    console.log(
        "connected succesfully"
    )
}).catch((err)=>{
    console.log("Server error" + err)
})


app.post("/creatuser", function(req,res){
    const data  = new User({
        username: "js223",
        email: "js@gmail.com",
        password: "js1234",
    });
    data.save();
    return res.status(200).json("data has been sumbitted")
})


app.listen(8200, ()=>{
    console.log("server is running on port 8200")
})
