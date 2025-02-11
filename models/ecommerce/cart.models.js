import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
