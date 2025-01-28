import { Router } from 'express';
const adminRoutes = Router();
import Order from '../models/order.js';
import Product from "../models/product.js";
import {authorizeRoles } from "../middlewares/authMiddleware.js";
import User from '../models/User.js';
import pkg from "bcryptjs";
const { hash } = pkg;

// Get all orders (including populated product details)
// Only Admins and Managers can access this route
adminRoutes.get('/orders', authorizeRoles("admin"), async (req, res) => {
  	try {
    	const orders = await Order.find().populate('items.productId');
    	res.json(orders);
  	} catch (error) {
    	res.status(500).json({ message: 'Error fetching orders' });
  	}
});

// Update order status (e.g., Pending -> Completed)
// Only Admins and Managers can access this route
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

// Delete an order by ID
// Only Admins can delete and order
// rather than delete I made it to make order as cancelled
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

// Get an order by ID (optional, for detailed view)
// Only Admins and Managers can access this route
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

// Manage Products (Optional: For Admin to view or delete products)
// this route exists for everybody in productRoutes
// adminRoutes.get('/products',  authorizeRoles("admin", "manager"), async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products' });
//   }
// });

// Create a new product (Only for Admin)
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

//better soft delete function but dont know whether to implement
// adminRoutes.delete('/products/:id', verifyToken, authorizeRoles("admin"), async (req, res) => {
// 	try {
// 	  const product = await Product.findById(req.params.id);
// 	  if (!product) {
// 			return res.status(404).json({ message: 'Product not found' });
// 	  }

// 	  // Soft delete: Mark as deleted instead of removing from DB
// 	  product.status = "deleted";  // Ensure `status` exists in the Product schema
// 	  product.updatedBy = req.user.id;  // Track who deleted it
// 	  await product.save();

// 	  res.json({ message: 'Product marked as deleted successfully' });

// 	} catch (error) {
// 	  console.error("Error deleting product:", error);
// 	  res.status(500).json({ message: 'Error deleting product' });
// 	}
// });

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


export default adminRoutes;