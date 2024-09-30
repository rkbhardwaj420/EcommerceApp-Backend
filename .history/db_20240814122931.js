import express from "express";
import dotenv  from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

const data = [{
    "id":0,
   "name":"jatin",
   "Class" : "C- class"
}, {
    "id":1,
    "name":"Rahul",
    "Class" : "A- class"
 }]

mongoose.connect(process.env.MONGODB).then(()=>{
    console.log(
        "connected succesfully"
    )
}).catch((err)=>{
    console.log("Server error" + err)
})
// Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    }
});
const User = mongoose.model('user', userSchema)


//get all data
//1: Method : -- GEt Method done
//2: RouteName : /getuser
//3: All Data :


///getbyId


//1: Method : -- GEt Method done
//getuser: getuserid
//2: getbyid
///

//res: status , json()   404 , 500 , 200 , 201 ,Server error
app.get("/getuser" , function(req, res){

return res.status(200).send(data);
});
app.get("/:getuserid" , function(req, res){
    return res.status(200).send(data.filter(fruit => fruit.id === 1))
})



app.listen( 8200, ()=>{
    console.log("server is running on port 8200")
})
