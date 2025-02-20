import mongoose from 'mongoose';

const userChoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    choice_color: {
        type: String
    },
    selected_size: {
        type: String
    },

})
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
        default: 0,
    },

    category_details: {
        type: String
    },
    quantity: {
         type: Number, default: 1 },
    color: {
        type: Array,
   default: ["Red", "Black", "Green", "White"],
    },
    user_choice: [userChoiceSchema],
    size: {
        type: Array,
        default: ["S","M","L","XL"],
    },
    image: {
        type: String
    },
    product_img: {
        type: [{
            image: { type: String },
            color: { type: String }
        }],
        default: []
}
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
