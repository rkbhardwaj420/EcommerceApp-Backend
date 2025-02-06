import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  shipping_address: { type: JSON, required: true },
  order_date: { type: Date, default: Date.now },
  payment_status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' },
  payment_method: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'COD', 'PhonePe', 'Google Pay'], // Added missing values
    required: true
  },
order_status: {
    type: String,
    enum: ['Order Confirmed', 'Seller Processed', 'Picked Up by Courier', 'Shipped', ' Received at Hub','Out for Delivery','Delivered'],default: 'Order Confirmed', // Added missing values
    required: true
  },
  order_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'orderitem', required: true }] // Changed from single ObjectId to an array
});

export const Order = mongoose.model("Order", OrderSchema);
