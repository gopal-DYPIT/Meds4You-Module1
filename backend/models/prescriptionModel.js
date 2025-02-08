import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true }, // Store file path
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Reviewed", "Completed"], default: "Pending" }, // ✅ Add status field
});

export default mongoose.model("Prescription", prescriptionSchema);
