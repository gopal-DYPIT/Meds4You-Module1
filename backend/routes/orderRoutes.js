import express from "express";
import mongoose from "mongoose";
import upload from "../middlewares/uploadMiddleware.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin/orders", authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name phoneNumber addresses")
      .populate(
        "items.productId",
        "drugName price imageUrl manufacturer alternateMedicines"
      )
      .lean(); // Convert to plain objects

    // console.log("All orders : ", orders)

    // Ensure that productId exists before accessing its properties
    const formattedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const product = item.productId;

        // Check if productId exists (could be null or undefined)
        if (!product) {
          return {
            ...item,
            productId: null,
            price: 0,
            name: "Unknown",
            manufacturer: "Unknown",
          };
        }

        // Otherwise, process with alternate medicines if available
        const alternateMedicine = product?.alternateMedicines?.[0] || product;

        return {
          ...item,
          productId: product._id, // Use main product ID reference
          name: alternateMedicine.name || product.drugName, // Fallback to drugName if no alternate
          price: alternateMedicine.price || product.price, // Use alternate medicine price if available
          manufacturer: alternateMedicine.manufacturer || product.manufacturer, // Use alternate manufacturer
        };
      }),
    }));

    // console.log("Formatted orders : ", formattedOrders)

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get(
  "/admin/orders/:orderId",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId)
        .populate("userId", "name phoneNumber addresses")
        .populate(
          "items.productId",
          "drugName price imageUrl manufacturer alternateMedicines"
        )
        .lean(); // Converts Mongoose documents to plain JavaScript objects

      // console.log("Particular order : \n", order);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Format the order with null checks for productId
      const formattedOrder = {
        ...order,
        items: order.items.map((item) => {
          const product = item.productId;

          // Check if productId is null or undefined
          if (!product) {
            return {
              ...item,
              productId: null,
              name: "Unknown Product",
              price: 0,
              manufacturer: "Unknown Manufacturer",
            };
          }

          const alternateMedicine = product?.alternateMedicines?.[0] || product; // Get the first alternate medicine if available

          return {
            ...item,
            productId: product._id,
            name: alternateMedicine.name || product.drugName,
            price: alternateMedicine.price || product.price,
            manufacturer:
              alternateMedicine.manufacturer || product.manufacturer,
          };
        }),
      };

      // console.log("Formatted order : \n", formattedOrder);

      res.status(200).json(formattedOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }
);

router.post("/create", authorizeRoles("user"), async (req, res) => {
  const { address, products, prescriptionUrl } = req.body;

  if (!address) return res.status(400).json({ error: "Address is required" });
  if(!prescriptionUrl) return res.status(400).json({ error: "Prescription is required" });

  try {
    const userId = req.user.id;

    // ✅ Prepare order items based on selection logic
    const orderItems = products.map(({ productId, quantity, selection }) => {
      let selectedProduct = productId;

      if (selection === "recommended" && productId.alternateMedicines?.length) {
        selectedProduct = productId.alternateMedicines[0]; // Use first alternate medicine
      }

      return {
        productId: new mongoose.Types.ObjectId(productId._id),
        quantity,
        price: selectedProduct.price,
        productDetails: {
          drugName: selectedProduct.name || selectedProduct.drugName, // Name for alt medicine, drugName otherwise
          imageUrl: selectedProduct.manufacturerUrl || selectedProduct.imageUrl, // Image URL
          size: productId.size, // Keep original size
          manufacturer: selectedProduct.manufacturer || productId.manufacturer,
          category: productId.category, // Keep original category
          salt: productId.salt, // Keep original salt composition
          mrp: productId.mrp, // Keep original MRP
          margin: productId.margin, // Keep original margin
        },
      };
    });

    // ✅ Calculate total amount based on selected medicines
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // ✅ Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      prescriptionUrl,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    res.status(200).json({ orderId: order._id, totalAmount });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "Failed to create order", details: error.message });
  }
});

router.post(
  "/payment-success",
  authorizeRoles("user"),
  async (req, res, next) => {
    const { paymentId, orderId } = req.body;
    const userId = req.user.id;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // updating order status
      order.paymentStatus = "success";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      await order.save();

      // clearing cart after successful payment
      const cart = await Cart.findOne({ userId });
      cart.items = [];
      await cart.save();

      res.status(200).json({ message: "Payment successful" });
    } catch (err) {
      console.error("Error updating payment status:", err);
      next(err);
    }
  }
);

router.get("/latest", authorizeRoles("user"), async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const userId = req.user.id;

    const latestOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name phoneNumber addresses")
      .exec();

    if (!latestOrder) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json(latestOrder);
  } catch (err) {
    console.error("Error fetching latest order:", err);
    res.status(500).json({ error: "Failed to fetch latest order" });
  }
});

router.put(
  "/orders/:orderId/status",
  authorizeRoles("admin"),
  async (req, res) => {
    // console.log("req.body", req.body);

    const { orderStatus, paymentStatus } = req.body;
    const { orderId } = req.params;
    const adminId = req.user.id; // Assuming req.user is set from auth middleware

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Validate order status
      const validOrderStatuses = [
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
      ];
      const validPaymentStatuses = [
        "pending",
        "failed",
        "paid",
        "refunded",
        "chargeback",
      ];

      if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({ error: "Invalid order status" });
      }

      if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ error: "Invalid payment status" });
      }

      // Update status and admin tracking
      order.orderStatus = orderStatus || order.orderStatus;
      order.paymentStatus = paymentStatus || order.paymentStatus;
      order.updatedBy = adminId;

      await order.save();

      res
        .status(200)
        .json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
);

router.get("/order-history", authorizeRoles("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // ✅ Return stored product details from order instead of populating productId
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId, // Keeping reference
        quantity: item.quantity,
        price: item.price,
        productDetails: item.productDetails, // ✅ Use saved product details
      })),
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

router.post(
  "/upload-prescription/",
  authorizeRoles("user"), // Ensure that only logged-in users can upload
  upload.single("prescription"), // Handle file upload with multer
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      // Construct the file URL
      const domain = process.env.DOMAIN || "meds4you.in"; // Fallback domain
      const fileUrl = `https://${domain}/uploads/${req.file.filename}`;

      // Respond with the file URL
      res.status(200).json({
        success: true,
        fileUrl: fileUrl, // Send back the URL for the uploaded prescription file
      });
    } catch (error) {
      console.error("❌ Error uploading prescription:", error);
      res.status(500).json({ error: "Error uploading prescription." });
    }
  }
);

export default router;
