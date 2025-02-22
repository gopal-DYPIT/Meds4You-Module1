import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  drugName: { type: String, required: true, trim: true, index: true },
  imageUrl: { type: String, trim: true },
  size: { type: String, trim: true },
  manufacturer: { type: String, required: true, trim: true, index: true },
  category: { type: String, trim: true },
  price: { type: Number, required: true, default: 0 },
  salt: { type: String, required: true, trim: true },
  alternateMedicines: [
    {
      name: { type: String, trim: true },
      size_1: { type: String, trim: true },
      manufacturerURL: { type: String, trim: true },
      price: { type: Number, default: 0 },
      mrp: { type: Number, required: true, default: 0 },
      Discount: { type: String, trim: true }
    }
  ],
  ConditionTreated: { type: String, trim: true },
  Usage: { type: String, trim: true },
  CommonSideEffects: { type: String, trim: true },
  mrp: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
