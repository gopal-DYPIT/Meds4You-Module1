import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";
import Partner from "../models/partner.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const router = express.Router();

// Aadhar Upload Route
router.post(
  "/upload/aadhar", // Remove this line for testing
  upload.single("aadhar"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const domain = process.env.DOMAIN || "meds4you.in";
      const aadharUrl = `https://${domain}/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: "Aadhar uploaded successfully!",
        aadharUrl,
      });
    } catch (error) {
      console.error("❌ Upload Error:", error);
      return res.status(500).json({ error: "Error uploading Aadhar." });
    }
  }
);

// PAN Upload Route
router.post("/upload/pan", upload.single("pan"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  try {
    const domain = process.env.DOMAIN || "meds4you.in";
    const panUrl = `https://${domain}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "PAN uploaded successfully!",
      panUrl,
    });
  } catch (error) {
    console.error("❌ Error uploading PAN:", error);
    res.status(500).json({ error: "Error uploading PAN." });
  }
});

// Partner Registration Route
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      aadharUrl,
      panUrl,
      bankAccountNumber,
      ifscCode,
      bankName,
      accountHolderName,
      referralCode,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !aadharUrl ||
      !panUrl ||
      !bankAccountNumber ||
      !ifscCode ||
      !bankName ||
      !accountHolderName
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if partner already exists
    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ error: "Partner already exists." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save bank details properly inside `bankDetails`
    const newPartner = new Partner({
      name,
      email,
      phone,
      password: hashedPassword,
      aadharUrl,
      panUrl,
      bankDetails: {
        accountNumber: bankAccountNumber,
        ifscCode,
        bankName,
        accountHolderName,
      },
      referralCode: referralCode || uuidv4().slice(0, 8).toUpperCase(),
      isVerified: false, // Partner needs admin approval
    });

    await newPartner.save();
    res.status(201).json({
      success: true,
      message: "Partner registered successfully. Awaiting admin approval.",
    });
  } catch (error) {
    console.error("❌ Error registering partner:", error);
    res.status(500).json({ error: "Error registering partner." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request Body:", req.body);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Only check the Partner collection
    const user = await Partner.findOne({ email });

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the account is verified
    if (!user.isVerified) {
      console.log("❌ User not verified!");
      return res
        .status(403)
        .json({ error: "Account not verified. Awaiting admin approval." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match!");
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate JWT Token
    console.log("✅ Password matched, generating token...");
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: "partner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful!");

    // Send response with phone and cashback info
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      userType: "partner",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        cashback: user.cashback || 0,
        referralCode: user.referralCode || null,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ error: "Error logging in." });
  }
});

export default router;
