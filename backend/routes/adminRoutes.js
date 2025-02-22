import { Router } from "express";
const adminRoutes = Router();
import Order from "../models/order.js";
import Product from "../models/product.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import pkg from "bcryptjs";
import referNum from "../models/referNum.js";
import Partner from "../models/partner.js";
const { hash } = pkg;

const generateReferralCode = async (name) => {
  //   return `${name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const refNum = await referNum.findOne();
  if (refNum == null) {
    const newRefNum = new referNum({
      number: 1000,
    });
    await newRefNum.save();
    return `${name.substring(0, 3).toUpperCase()}-1000`;
  }
  const newNum = refNum.number + 1;
  refNum.number = newNum;
  await refNum.save();
  return `${name.substring(0, 3).toUpperCase()}-${newNum}`;
};

adminRoutes.get("/orders", authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});



//Approve Users
// Get all pending users for admin approval
adminRoutes.get("/users/pending", authorizeRoles("admin"), async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Error fetching pending users" });
  }
});

// Approve a user
adminRoutes.put("/users/:id/approve", authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = true;
    await user.save();
    res.json({ message: "User approved successfully!", user });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Error approving user" });
  }
});

// Reject a user
adminRoutes.delete("/users/:id/reject", authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User rejected and removed successfully" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ message: "Error rejecting user" });
  }
});


//orders

adminRoutes.put(
  "/orders/:id/status",
  authorizeRoles("admin"),
  async (req, res) => {
    const { orderStatus, paymentStatus } = req.body;

    if (!orderStatus || !paymentStatus) {
      return res
        .status(400)
        .json({ message: "Both orderStatus and paymentStatus are required" });
    }

    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (orderStatus === "confirmed" && paymentStatus !== "paid") {
        return res
          .status(400)
          .json({
            message:
              "Cannot mark order as Completed without payment confirmation",
          });
      }

      order.orderStatus = orderStatus;
      order.paymentStatus = paymentStatus;
      order.updatedBy = req.user.id; // Tracking who updated
      order.updatedAt = Date.now();

      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error updating order status" });
    }
  }
);

adminRoutes.post("/orders/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.orderStatus = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

adminRoutes.get("/orders/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details" });
  }
});

adminRoutes.post("/products", authorizeRoles("admin"), async (req, res) => {
  try {
    const {
      drugName,
      imageUrl,
      size,
      manufacturer,
      category,
      price,
      salt,
      margin,
      alternateMedicines = [], // Default to empty array
    } = req.body;

    // Validate required fields
    if (!drugName || !category || !price || !salt) {
      return res
        .status(400)
        .json({ message: "Drug Name, category, price, and salt are required" });
    }

    // Ensure price is a positive number
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than zero" });
    }

    // Calculate MRP (5% increase over price)
    const mrp = parseFloat((price * 1.05).toFixed(2));

    // Validate alternate medicines
    const validatedAlternateMedicines = alternateMedicines.map((alt) => ({
      name: alt.name || "Unknown",
      manufacturer: alt.manufacturer || "Unknown",
      manufacturerUrl: alt.manufacturerUrl || "",
      price: alt.price > 0 ? alt.price : 0,
      mrp: alt.mrp ? alt.mrp : parseFloat((alt.price * 1.05).toFixed(2)), // Ensure MRP for alternates
      salt: alt.salt || salt, // Default to main medicine's salt
    }));

    // Create a new medicine product
    const newMedicine = new Product({
      drugName,
      imageUrl,
      size,
      manufacturer,
      category,
      price,
      mrp,
      salt,
      margin,
      alternateMedicines: validatedAlternateMedicines,
      createdBy: req.user.id, // Track admin user
    });

    // Save to database
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({ message: "Error creating medicine" });
  }
});


// Delete a product (Only for Admin)
adminRoutes.delete(
  "/products/:id",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
);

adminRoutes.post(
  "/registerAdmin",
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Please fill all fields !" });
      }

      // if(role === "user" && (!managerId || !adminId)){
      //     return res.status(400).json({ message: "Please provide managerId and adminId !" });
      // }

      // if(role === "manager" && !adminId){
      //     return res.status(400).json({ message: "Please provide adminId !" });
      // }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          message: `User with email ${email} already exists !`,
        });
      }

      const hashedPassword = await hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
        role: "admin",
      });
      await newUser.save();
      res.status(201).json({
        message: `Admin registered with email ${email}`,
      });
    } catch (err) {
      next(err);
    }
  }
);

adminRoutes.get(
  "/partners/pending",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const pendingPartners = await Partner.find({ isVerified: false });
      res.status(200).json(pendingPartners);
    } catch (error) {
      console.error("\u274C Error fetching pending partners:", error);
      res.status(500).json({ message: "Error fetching pending partners" });
    }
  }
);

adminRoutes.put(
  "/partners/:id/approve",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const partner = await Partner.findById(req.params.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      // Ensure bank details exist before approving
      if (
        !partner.bankDetails ||
        !partner.bankDetails.accountNumber ||
        !partner.bankDetails.ifscCode ||
        !partner.bankDetails.bankName ||
        !partner.bankDetails.accountHolderName
      ) {
        return res.status(400).json({
          message: "Bank details are incomplete. Cannot approve the request.",
        });
      }

      partner.isVerified = true;
      await partner.save();

      res.json({
        message: "Partner approved successfully! Now they can log in.",
        partner,
      });
    } catch (error) {
      console.error("\u274C Error approving partner:", error);
      res.status(500).json({ message: "Error approving partner" });
    }
  }
);

adminRoutes.put(
  "/partners/:id/reject",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const partner = await Partner.findById(req.params.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      partner.isVerified = false;
      await partner.save();

      res.json({ message: "Partner request rejected successfully" });
    } catch (error) {
      console.error("\u274C Error rejecting partner request:", error);
      res.status(500).json({ message: "Error rejecting partner request" });
    }
  }
);





export default adminRoutes;
