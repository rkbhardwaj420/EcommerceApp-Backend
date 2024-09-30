import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    productImage:{

    }
},{timestamps: true})


export const Product = mongoose.model("Product", productSchema )
