import express from "express";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin/orders", authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find() // Use find() to get all orders
      .populate("userId", "name phoneNumber addresses") // Populate user info
      .populate("items.productId", "drugName price imageUrl manufacturer") // Populate product info in items
      .exec();

    // console.log("Orders fetched for admin:", JSON.stringify(orders, null, 2));
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
router.get("/admin/orders/:orderId", authorizeRoles("admin"), async (req, res) => {
  try {
    const { orderId } = req.params; // Get orderId from the request parameters
    const order = await Order.findById(orderId)
      .populate("userId", "name phoneNumber addresses")
      .populate("items.productId", "drugName price imageUrl manufacturer")
      .exec();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // console.log("Order fetched for admin:", JSON.stringify(order, null, 2));
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});


router.post("/create", authorizeRoles("user"), async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId"); // Populate productId in cart items
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (!cart.items.length) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      const alternateMedicine =
        item.productId.alternateMedicines &&
        item.productId.alternateMedicines.length > 0
          ? item.productId.alternateMedicines[0]
          : item.productId;

      const price = alternateMedicine.price || item.productId.price;
      return total + price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      items: cart.items.map((item) => {
        const alternateMedicine =
          item.productId.alternateMedicines &&
          item.productId.alternateMedicines.length > 0
            ? item.productId.alternateMedicines[0]
            : item.productId;

        return {
          productId: alternateMedicine._id || item.productId._id,
          quantity: item.quantity,
          price: alternateMedicine.price || item.productId.price,
        };
      }),
      totalAmount,
    });

    await order.save();

    // Optionally clear the cart after order is created
    // cart.items = [];
    // await cart.save();

    // console.log("Order created successfully:", order);
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
