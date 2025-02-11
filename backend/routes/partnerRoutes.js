import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import PendingPartner from "../models/partnerApprovals.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Aadhar Upload Route
router.post(
  "/upload/aadhar",
  authorizeRoles("user"),
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
      console.error("❌ Error uploading Aadhar:", error);
      res.status(500).json({ error: "Error uploading Aadhar." });
    }
  }
);

// PAN Upload Route
router.post(
  "/upload/pan",
  authorizeRoles("user"),
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

    // Create new pending partner request
    const newPendingPartner = new PendingPartner({
      name,
      email,
      phone,
      password, // Will be hashed before saving (pre-save hook)
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

export default router;
