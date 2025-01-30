import express from "express";
import Product from "../models/product.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Fetch all products with search functionality
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { drugName: { $regex: search, $options: "i" } },
          { manufacturer: { $regex: search, $options: "i" } },
          { salt: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch a single product by ID and its alternate products
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find alternate products with the same salt
    const alternates = await Product.find({
      salt: product.salt,
      _id: { $ne: product._id }, // Exclude the current product
    }).select("drugName manufacturer price mrp");

    product.alternateMedicines = alternates; // ✅ Match schema field

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a new product
router.post("/createProduct",authenticateToken, async (req, res) => {
  try {
    const {
      drugName,
      size,
      imageUrl,
      manufacturer,
      category,
      price,
      salt,
      mrp,
      margin,
      alternateMedicines, // ✅ Expecting an array of alternate medicines
    } = req.body;

    // Validate required fields
    if (!drugName || !salt || !manufacturer || !price || !mrp || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new product
    const product = new Product({
      drugName,
      size,
      imageUrl,
      manufacturer,
      category,
      price,
      salt,
      mrp,
      margin: margin || (mrp - price), // Auto-calculate margin if not provided
      alternateMedicines: alternateMedicines || [], // Ensure it's an array
    });

    // Save the product
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


export default router;
