import mongoose from "mongoose"; // Add this line to import mongoose

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field before saving
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
