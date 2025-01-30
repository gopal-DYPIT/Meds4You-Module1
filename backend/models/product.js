import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  drugName: { type: String, required: true, trim: true, index: true }, // Drug Name
  imageUrl: { type: String, trim: true }, // Image URL
  size: { type: String, trim: true }, // Strip/Bottle size
  manufacturer: { type: String, required: true, trim: true, index: true }, // Manufacturer
  category: { type: String, trim: true }, // ✅ Added category
  price: { type: Number, required: true, default: 0 }, // ✅ Ensure price is required
  salt: { type: String, required: true, trim: true }, // Salt Composition
  mrp: { type: Number, required: true, default: 0 }, // MRP
  margin: { type: Number, default: 0 }, // Margin
  alternateMedicines: [
    {
      name: { type: String, trim: true },
      manufacturer: { type: String, trim: true },
      manufacturerUrl: { type: String, trim: true },
      price: { type: Number, default: 0 },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
