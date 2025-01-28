import { Schema , model } from "mongoose";

const bdeSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    earnings: { type: Number, default: 0 },
    address: { type: String },
}, { timestamps: true });

export default model("Bde", bdeSchema);