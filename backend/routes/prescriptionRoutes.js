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
      // console.log("✅ File URL:", fileUrl);

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

router.get("/user", authorizeRoles("user"), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id })
      .select("fileUrl status uploadedAt")
      .sort({ uploadedAt: -1 });

    // ✅ Convert uploadedAt to ISO string before sending
    const formattedPrescriptions = prescriptions.map(prescription => ({
      ...prescription.toObject(),
      uploadedAt: prescription.uploadedAt.toISOString()
    }));

    res.status(200).json(formattedPrescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions." });
  }
});

router.put("/update-status/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // ✅ Ensures MongoDB returns the updated document
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ message: "Status updated successfully", prescription });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ message: "Error updating prescription status" });
  }
});




export default router;
