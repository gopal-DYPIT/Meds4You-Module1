  import mongoose from "mongoose";

  const productSchema = new mongoose.Schema({
    drugName: { type: String, required: true, trim: true, index: true }, // Drug Name
    imageUrl: { type: String, trim: true }, // Image URL
    size: { type: String, trim: true }, // Strip/Bottle size
    manufacturer: { type: String, required: true, trim: true, index: true }, // Manufacturer
    category: { type: String, trim: true }, // ✅ Added category
    price: { type: Number, required: true, default: 0 }, // ✅ Ensure price is required
    salt: { type: String, required: true, trim: true }, // Salt Composition
    margin: { type: Number, default: 0 }, // Margin
    alternateMedicines: [
      {
        name: { type: String, trim: true },
        manufacturer: { type: String, trim: true },
        manufacturerUrl: { type: String, trim: true },
        mrp: { type: Number, required: true, default: 0 },
        price: { type: Number, default: 0 },
        salt: { type: String, required: true, trim: true }, // Salt Composition
      }
    ],
    createdAt: { type: Date, default: Date.now },
    mrp: { type: Number, required: true, default: 0 }, // MRP
  });

  const Product = mongoose.model("Product", productSchema);
  export default Product;
