import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    category:{
        type: String,

    },
    stock: {
        type: Number,
        default: 3,
    },

    category_details: {
        type: String
    },
    color: {
        type: Array,
default: ["Red", "Black", "Green", "White"],
    },
    size: {
        type: Array,
        default: ["S","M","L","XL"],
    },
    image: {
        type: String
    }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
