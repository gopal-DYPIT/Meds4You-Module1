import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  aadharUrl: { type: String,required: true }, // Unique referral code for others to use
  panUrl: { type: String, required: true }, // Reward points
  cashBack: { type: Number, default: 0 } // Redeemed points
}, {timestamps: true});

// Hash password before saving
partnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Partner", partnerSchema);
