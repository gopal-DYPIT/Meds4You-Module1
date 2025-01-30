// import { Schema , model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String }, // URL for product image
    description: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String }, // URL for brand image
    category: { type: String, required: true }, // Category of the product
    price: { type: Number, required: true, min: 0  },
    discount: { type: Number,min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

// export default model("Product", productSchema);