import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    referralCode: { type: String, unique: true, sparse: true },
    aadharUrl: { type: String, required: true },
    panUrl: { type: String, required: true },
    cashBack: { type: Number, default: 0 },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
    businessPartnerNumber: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to generate business partner number before saving
partnerSchema.pre("save", async function (next) {
  if (!this.businessPartnerNumber) {
    try {
      const partnerType = "B1"; // Define partner type dynamically if needed

      // Generate date in DDMMYY format
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${String(now.getFullYear()).slice(2)}`;

      let uniqueId;
      let isUnique = false;

      while (!isUnique) {
        // Fetch the current count of partners for the day
        const count = await this.constructor.countDocuments({
          createdAt: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lt: new Date().setHours(23, 59, 59, 999),
          },
        });

        uniqueId = String(count + 1).padStart(6, "0"); // Ensure uniqueness
        this.businessPartnerNumber = `BPA(${partnerType})(${dateStr})(${uniqueId})`;

        // Check if this businessPartnerNumber already exists
        const existingPartner = await this.constructor.findOne({
          businessPartnerNumber: this.businessPartnerNumber,
        });
        if (!existingPartner) {
          isUnique = true; // Found a unique business partner number
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model("Partner", partnerSchema);
