import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
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
        "pending", // Order placed but not yet processed
        "on_hold", // Order temporarily paused (e.g., fraud check, stock issue)
        "processing", // Order being prepared
        "confirmed", // Payment confirmed, order ready to ship
        "shipped", // Order dispatched
        "out_for_delivery", // Out for last-mile delivery
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
