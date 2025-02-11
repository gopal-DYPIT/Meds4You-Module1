import { Router } from 'express';
const adminRoutes = Router();
import Order from '../models/order.js';
import Product from "../models/product.js";
import {authorizeRoles } from "../middlewares/authMiddleware.js";
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import pkg from "bcryptjs";
import PendingRequest from '../models/partnerApprovals.js';
import Partner from '../models/partner.js';
const { hash } = pkg;

adminRoutes.get('/orders', authorizeRoles("admin"), async (req, res) => {
  	try {
    	const orders = await Order.find().populate('items.productId');
    	res.json(orders);
  	} catch (error) {
    	res.status(500).json({ message: 'Error fetching orders' });
  	}
});

adminRoutes.put('/orders/:id/status', authorizeRoles("admin"), async (req, res) => {
  	const { orderStatus, paymentStatus } = req.body;

  	if (!orderStatus || !paymentStatus) {
    	return res.status(400).json({ message: 'Both orderStatus and paymentStatus are required' });
  	}

  	try {
    	const order = await Order.findById(req.params.id);
    	if (!order) {
    	  	return res.status(404).json({ message: 'Order not found' });
    	}

    	if (orderStatus === "confirmed" && paymentStatus !== "paid") {
     		return res.status(400).json({ message: 'Cannot mark order as Completed without payment confirmation' });
    	}

    	order.orderStatus = orderStatus;
    	order.paymentStatus = paymentStatus;
    	order.updatedBy = req.user.id;  // Tracking who updated
    	order.updatedAt = Date.now();

    	await order.save();
    	res.json(order);
  	} catch (error) {
    	res.status(500).json({ message: 'Error updating order status' });
  	}
});

adminRoutes.post('/orders/:id', authorizeRoles("admin"), async (req, res) => {
  	try {
    	const order = await Order.findById(req.params.id);
    	if (!order) {
      		return res.status(404).json({ message: 'Order not found' });
    	}
		order.orderStatus = "cancelled";
		await order.save();

    	res.json({ message: 'Order cancelled successfully' });
  	} catch (error) {
    	res.status(500).json({ message: 'Error deleting order' });
  	}
});	

adminRoutes.get('/orders/:id',  authorizeRoles("admin"), async (req, res) => {
  	try {
    	const order = await Order.findById(req.params.id).populate('items.productId');
    	if (!order) {
      		return res.status(404).json({ message: 'Order not found' });
    	}
    	res.json(order);
  	} catch (error) {
    	res.status(500).json({ message: 'Error fetching order details' });
  	}
});

adminRoutes.post("/products",authorizeRoles("admin"), async (req, res) => {
	try {
	  	const { name, image, description, type, brand, category, price, discount } = req.body;

	  	// Validate required fields
	  	if (!name || !category || !price) {
			return res.status(400).json({ message: "Name, category, and price are required" });
	  	}

	  	// Ensure price is a positive number
	  	if (price <= 0) {
			return res.status(400).json({ message: "Price must be greater than zero" });
	  	}

	  	// Create a new product
	  	const newProduct = new Product({
			name,
			image,
			description,
			type,
			brand,
			category,
			price,
			discount: discount || 0,  // Default discount to 0 if not provided
			createdBy: req.user.id,  // Track the user who created the product
	  	});

	  	// Save the product
	  	await newProduct.save();
	  	res.status(201).json(newProduct);

	} catch (error) {
	  	console.error("Error creating product:", error);
	  	res.status(500).json({ message: "Error creating product" });
	}
});


// Delete a product (Only for Admin)
adminRoutes.delete('/products/:id', authorizeRoles("admin"), async (req, res) => {
  	try {
    	const product = await Product.findByIdAndDelete(req.params.id);
    	if (!product) {
      		return res.status(404).json({ message: 'Product not found' });
    	}
    	res.json({ message: 'Product deleted successfully' });
  	} catch (error) {
    	res.status(500).json({ message: 'Error deleting product' });
  	}
});



adminRoutes.post('/registerAdmin',  authorizeRoles("admin"), async (req, res, next) => {
    try{
        const { email , password } = req.body

        if(!email || !password){
            return res.status(400).json({ message: "Please fill all fields !" });
        }

        // if(role === "user" && (!managerId || !adminId)){
        //     return res.status(400).json({ message: "Please provide managerId and adminId !" });
        // }

        // if(role === "manager" && !adminId){
        //     return res.status(400).json({ message: "Please provide adminId !" });
        // }

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
                message: `User with email ${email} already exists !`
            });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = new User({ email , password: hashedPassword , role: "admin" });
        await newUser.save();
        res.status(201).json({
            message: `Admin registered with email ${email}`
        });
    } catch(err) {
        next(err);
    }
});

adminRoutes.get("/partners/pending", authorizeRoles("admin"), async (req, res) => {
	try {
	  const pendingPartners = await PendingRequest.find();
	  res.status(200).json(pendingPartners);
	} catch (error) {
	  console.error("❌ Error fetching pending partners:", error);
	  res.status(500).json({ message: "Error fetching pending partners" });
	}
});

adminRoutes.put("/partners/:id/approve", authorizeRoles("admin"), async (req, res) => {
	try {
	  // Find the pending partner request
	  const pendingPartner = await PendingRequest.findById(req.params.id);
	  if (!pendingPartner) {
			return res.status(404).json({ message: "Pending partner request not found" });
	  }

	  // Hash the password before moving to Partner model
	  const hashedPassword = await bcrypt.hash(pendingPartner.password, 10);

	  // Create a new partner in the Partner collection
	  const newPartner = new Partner({
			name: pendingPartner.name,
			email: pendingPartner.email,
			phone: pendingPartner.phone,
			password: hashedPassword, // Store hashed password
			referralCode: pendingPartner.referralCode,
			aadharUrl: pendingPartner.aadharUrl,
			panUrl: pendingPartner.panUrl,
			cashBack: 0, // Default cashback
			createdAt: pendingPartner.createdAt,
			updatedAt: Date.now(),
	  });

	  await newPartner.save(); // Save to Partner collection

	  // Remove from pending requests
	  await PendingRequest.findByIdAndDelete(req.params.id);

	  res.json({ message: "Partner approved successfully! Now they can log in.", partner: newPartner });
	} catch (error) {
	  console.error("❌ Error approving partner:", error);
	  res.status(500).json({ message: "Error approving partner" });
	}
});

adminRoutes.delete('/partners/:id/reject', authorizeRoles("admin"), async (req, res) => {
	try {
	  const pendingPartner = await PendingRequest.findById(req.params.id);
	  if (!pendingPartner) {
			return res.status(404).json({ message: "Pending partner request not found" });
	  }

	  await PendingRequest.findByIdAndDelete(req.params.id);
	  res.json({ message: "Partner request rejected successfully" });
	} catch (error) {
	  console.error("❌ Error rejecting partner request:", error);
	  res.status(500).json({ message: "Error rejecting partner request" });
	}
});



export default adminRoutes;