import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        productDetails: {
          drugName: { type: String, required: true },
          imageUrl: { type: String, required: true },
          size: { type: String, required: true },
          manufacturer: { type: String, required: true },
          category: { type: String, required: true },
          salt: { type: String, required: true },
          mrp: { type: Number, required: true },
          margin: { type: Number, required: true },
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "failed", "paid", "refunded", "chargeback"],
      default: "pending",
    },
    paymentId: { type: String },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "on_hold",
        "processing",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "failed",
      ],
      default: "pending",
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
