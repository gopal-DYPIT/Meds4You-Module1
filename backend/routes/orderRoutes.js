import express from "express";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin/orders", authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name phoneNumber addresses")
      .populate("items.productId", "drugName price imageUrl manufacturer alternateMedicines")
      .lean(); // Convert to plain objects

      // console.log("All orders : ", orders)

    // Ensure that productId exists before accessing its properties
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        const product = item.productId;
        
        // Check if productId exists (could be null or undefined)
        if (!product) {
          return { ...item, productId: null, price: 0, name: "Unknown", manufacturer: "Unknown" };
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


router.get("/admin/orders/:orderId", authorizeRoles("admin"), async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("userId", "name phoneNumber addresses")
      .populate("items.productId", "drugName price imageUrl manufacturer alternateMedicines")
      .lean(); // Converts Mongoose documents to plain JavaScript objects

    // console.log("Particular order : \n", order);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Format the order with null checks for productId
    const formattedOrder = {
      ...order,
      items: order.items.map(item => {
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
          manufacturer: alternateMedicine.manufacturer || product.manufacturer,
        };
      }),
    };

    // console.log("Formatted order : \n", formattedOrder);

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});



router.post("/create", authorizeRoles("user"), async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address is required" });

  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || !cart.items.length) {
      return res.status(404).json({ error: "Cart is empty or not found" });
    }

    // ✅ Calculate total amount using alternate medicine if available
    const totalAmount = cart.items.reduce((total, { productId, quantity }) => {
      const altMedicine = productId.alternateMedicines?.[0] || productId;
      return total + (altMedicine.price || productId.price) * quantity;
    }, 0);

    // ✅ Prepare order items (Fixed `ObjectId` error)
    const orderItems = cart.items.map(({ productId, quantity }) => {
      const altMedicine = productId.alternateMedicines?.[0] || productId;
      return {
        productId: new mongoose.Types.ObjectId(productId._id), // ✅ Fixed syntax
        quantity,
        price: altMedicine.price || productId.price,
        name: altMedicine.name || productId.drugName,
        manufacturer: altMedicine.manufacturer || productId.manufacturer,
      };
    });

    // ✅ Create and save order
    const order = await Order.create({ userId, items: orderItems, totalAmount });
    // console.log("Order created:", order);

    // ✅ Clear the cart after order creation
    await Cart.updateOne({ userId }, { $set: { items: [] } });

    res.status(200).json({ orderId: order._id, totalAmount });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
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
      .populate("items.productId" , "drugName price imageUrl manufacturer")
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

export default router;
