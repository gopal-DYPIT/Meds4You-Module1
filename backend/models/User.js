import { Schema, model } from "mongoose";

// Define the user schema
const userSchema = new Schema({
    email: { type: String, required: true },  // Ensure email is unique or indexed if necessary
    password: { type: String, required: true }, // Make sure to hash this password before saving
    name: { type: String, required: true, ref: "User" }, // Name of the user
    phoneNumber: { type: String, required: true }, // Phone number should be unique if that's your use case
    referralCode: { type: String }, // Unique referral code for each user
    role: { type: String, enum: ["user", "admin"],  required: true },
    addresses: [{
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
      }] 
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

// Export the model
export default model("User", userSchema);
