const productSchema = new mongoose.Schema(
  {
    description: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    productImage: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      default: 0,
      type: Number
    },
    category: {
      type: String,
      enum: ['Men', 'Girls', 'Kids', 'Footwear', 'Accessories', 'Beauty & Grooming', 'Jewellery', 'Home & Living'],
      required: true
    },
    subcategory: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
