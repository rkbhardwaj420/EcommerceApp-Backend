import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    status: { type: String, enum: ['Pending', 'Completed', 'Shipped', 'Cancelled', 'Inprogress'], default: 'Inprogress' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }, // Default quantity is 1
    orderitem_date: { type: Date, default: Date.now },
    price_per_item: { type: Number, required: true },
}, { timestamps: true });

export const OrderItem = mongoose.model('OrderItem', OrderItemSchema);


