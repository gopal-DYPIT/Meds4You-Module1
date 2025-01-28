import { Schema, model } from "mongoose";

// Define the user schema
const userSchema = new Schema({
    email: { type: String, required: true },  // Ensure email is unique or indexed if necessary
    password: { type: String, required: true }, // Make sure to hash this password before saving
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Phone number should be unique if that's your use case
    // storePartnerReferenceId: { type: String, ref: "StorePartner" }, 
    // earnings: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"],  required: true },
    addresses: [{
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String, required: true },
        isPrimary: { type: Boolean, default: false } // Track the primary address
      }], 
    // bdeId: { type: Schema.Types.ObjectId, required: true, ref: "BDE" }  
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

// Export the model
export default model("User", userSchema);
