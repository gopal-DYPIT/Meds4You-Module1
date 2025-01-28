import { Schema , model } from "mongoose";

const storePartnerSchema = new Schema({
    referenceId: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    earnings: { type: Number, default: 0 },
    address: { type: String, required: true },
    bdeId: { type: Schema.Types.ObjectId }
}, { timestamps: true });

export default model("StorePartner", storePartnerSchema);