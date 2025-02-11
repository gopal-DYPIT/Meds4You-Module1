import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import PendingPartner from "../models/partnerApprovals.js";
import referNum from "../models/referNum.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const generateReferralCode = async (name) => {
//   return `${name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const refNum = await referNum.findOne();
    if(refNum == null){
        const newRefNum = new referNum({
            number: 1000
        });
        await newRefNum.save();
        return `${name.substring(0, 3).toUpperCase()}-1000`;
    }
    const newNum = refNum.number + 1;
    refNum.number  = newNum;
    await refNum.save();
    return `${name.substring(0, 3).toUpperCase()}-${newNum}`;
};

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

    const referralCode = await generateReferralCode(name);
    // Create new pending partner request
    const newPendingPartner = new PendingPartner({
      name,
      email,
      phone,
      password, // Will be hashed before saving (pre-save hook)
      referralCode,
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
