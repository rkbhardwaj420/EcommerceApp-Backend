import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    status: { type: String, enum: ['Pending', 'Completed', 'Shipped', 'Cancelled','Inprogress'], default: 'Inprogress' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    orderitem_date: { type: Date, default: Date.now },
    price_per_item: { type: Number, required: true },

},{ timestamps: true });
export const OrderItem = mongoose.model("orderitem",   OrderItemSchema);

