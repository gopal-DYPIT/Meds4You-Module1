import express from "express";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router(); 
 
router.post("/create", authorizeRoles("user"), async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (!cart.items.length) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      totalAmount,
    });

    await order.save();

    // cart.items = [];
    // await cart.save();
    console.log("Order created successfully:", order);
    res.status(200).json({ orderId: order._id, totalAmount });
  } catch (err) {
    console.error("Error creating order:", err);
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
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
    // Ensure the user is authenticated and req.user contains the user object
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const userId = req.user.id;
    
    const latestOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 }) // Sort by creation date, descending
      .populate("items"); // You can populate order items if you need more info, remove if unnecessary

    // Check if the latest order exists
    if (!latestOrder) {
      return res.status(404).json({ error: "No orders found" });
    }

    // Return the latest order details
    res.status(200).json(latestOrder);
  } catch (err) {
    console.error("Error fetching latest order:", err);
    res.status(500).json({ error: "Failed to fetch latest order" });
  }
});

router.put("/orders/:orderId/status", authorizeRoles("admin"), async (req, res) => {
  console.log("req.body", req.body);

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
      "pending", "on_hold", "processing", "confirmed",
      "shipped", "out_for_delivery", "delivered", 
      "cancelled", "returned", "failed"
    ];
    const validPaymentStatuses = ["pending", "failed", "paid", "refunded", "chargeback"];

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

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});


export default router;
