// import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Referrer from "../models/referrerSchema.js";
import referNum from "../models/referNum.js";

const router = Router();

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

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingReferrer = await Referrer.findOne({ email });
    if (existingReferrer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const referralCode = await generateReferralCode(name);

    const newReferrer = new Referrer({
      name,
      email,
      phone,
      password,
      referralCode,
    });

    await newReferrer.save();
    res.status(201).json({ message: "Referral program registration successful", referralCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const referrer = await Referrer.findOne({ email });
    if (!referrer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, referrer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: referrer._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, referrer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
