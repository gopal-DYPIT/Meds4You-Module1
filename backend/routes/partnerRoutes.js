import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import PendingPartner from "../models/partnerApprovals.js";
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
router.post(
  "/upload/pan",
  upload.single("pan"),
  async (req, res) => {
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
  }
);

// Partner Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, aadharUrl, panUrl } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !aadharUrl || !panUrl) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if partner already exists in pendingRequest
    const existingPartner = await PendingPartner.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ error: "Partner request already exists." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new pending partner request
    const newPendingPartner = new PendingPartner({
      name,
      email,
      phone,
      password: hashedPassword, // Store hashed password
      aadharUrl,
      panUrl,
    });

    await newPendingPartner.save();
    res.status(201).json({
      success: true,
      message: "Partner request submitted successfully. Awaiting admin approval.",
    });
  } catch (error) {
    console.error("❌ Error registering partner:", error);
    res.status(500).json({ error: "Error registering partner." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    let user = await Partner.findOne({ email });
    let userType = "partner"; // Default type

    if (!user) {
      // If not a partner, check Referral collection
      user = await Referral.findOne({ email });
      userType = "referral";
    }

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType }, // Include userType in token
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response with user type
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      userType, // ✅ Include userType to determine dashboard
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode || null, // Referral code if available
      },
    });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ error: "Error logging in." });
  }
});


export default router;
