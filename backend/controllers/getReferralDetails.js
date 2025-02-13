import Referrer from "../models/referrerSchema.js";
import Partner from "../models/partner.js";

export const getReferralDetails = async (req, res) => {
  try {
    const { referralCode } = req.params;

    if (!referralCode) {
      return res.status(400).json({ message: "Referral code is required" });
    }

    // Check if the referral code belongs to a Referrer
    const referrer = await Referrer.findOne({ referralCode }).select("name email");
    if (referrer) {
      return res.status(200).json({
        type: "Referrer",
        name: referrer.name,
        email: referrer.email,
      });
    }

    // Check if the referral code belongs to a Partner
    const partner = await Partner.findOne({ referralCode }).select("name email");
    if (partner) {
      return res.status(200).json({
        type: "Partner",
        name: partner.name,
        email: partner.email,
      });
    }

    // If referral code doesn't exist in either collection
    return res.status(404).json({ message: "Invalid referral code" });

  } catch (error) {
    console.error("Error fetching referral details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
