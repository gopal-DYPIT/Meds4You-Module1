import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Partner from "../models/partner.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// const register = async (req, res) => {
//   try {
//     const { phoneNumber, password, email, name } =
//       req.body;

//     // const defaultBdeId = "60d4b1f6b47c7c4b0877f473";

//     if (!phoneNumber || !password || !email || !name) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all required fields!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       phoneNumber,
//       password: hashedPassword,
//       email,
//       name,
//       role: "user",
//     });

//     await newUser.save();
//     res.status(201).json({
//       message: `User registered with phone number ${phoneNumber}`,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Internal Server Error" });
//     console.log(err);
//   }
// };
const register = async (req, res) => {
  try {
    const { phoneNumber, password, email, name, referredBy } = req.body;

    if (!phoneNumber || !password || !email || !name) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const referralCode = uuidv4().slice(0, 8).toUpperCase();

    let referrer = null;

    if (referredBy) {
      // Check if the referral code exists in either Partner or Referrer collection
      referrer =
        (await Partner.findOne({ referralCode: referredBy })) ||
        (await User.findOne({ referralCode: referredBy }));

      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code!" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      email,
      name,
      role: "user",
      referralCode,
      referredBy,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully", referralCode });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: `User with email ${email} not found!`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error!", message: err.message });
  }
};
const getReferredUsers = async (req, res) => {
  try {
      const { referralCode } = req.params;
      const referredUsers = await User.find({ referredBy: referralCode });

      res.status(200).json({ referredUsers });
  } catch (error) {
      res.status(500).json({ message: "Error fetching referrals", error: error.message });
  }
};


export { register, login, getReferredUsers };
