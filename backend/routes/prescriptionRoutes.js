import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import Prescription from "../models/prescriptionModel.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Upload Prescription
router.post(
  "/upload",
  authorizeRoles("user"),
  upload.single("prescription"),
  async (req, res) => {
    if (!req.file) {
      console.error("❌ Multer did NOT receive any file!");
      return res.status(400).json({ error: "No file uploaded." });
    }

    // console.log("✅ Multer received file:", req.file.path); // Log received file

    try {
      const domain = process.env.DOMAIN || "meds4you.in"; // Fallback domain
      const fileUrl = `https://${domain}/uploads/${req.file.filename}`;
      console.log("✅ File URL:", fileUrl);

      // console.log("✅ File should be accessible at:", fileUrl);

      const newPrescription = new Prescription({
        userId: req.user.id,
        fileUrl,
      });

      await newPrescription.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Prescription uploaded successfully!",
          fileUrl,
        });
    } catch (error) {
      console.error("❌ Error saving prescription:", error);
      res.status(500).json({ error: "Error saving prescription." });
    }
  }
);

// Fetch All Prescriptions for Admin Dashboard
router.get("/admin", authorizeRoles("admin"), async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("userId", "name email phoneNumber") // Populate user info
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions." });
  }
});

export default router;
