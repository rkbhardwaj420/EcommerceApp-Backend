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



//res: status , json()   404 , 500 , 200 , 201 ,Server error
app.get("/getuser" , function(req, res){

return res.status(200).send(data);
});
app.get("/:getuserid" , function(req, res){
    return res.status(200).send(data.filter(fruit => fruit.id === 1))
})

app.post("/creatuser", function(req,res){
    const data  = new User({
        username: "js223",
        email: "js@gmail.com",
        password: "js1234",
    });
    data.save();
})


app.listen( 8200, ()=>{
    console.log("server is running on port 8200")
})
