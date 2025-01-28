import express from 'express';
import Cart from '../models/cart.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {authorizeRoles} from '../middlewares/authMiddleware.js';

dotenv.config();  // Load environment variables from .env file

const router = express.Router();


router.post('/add', authorizeRoles('user'), async (req, res) => {
  let { productId, quantity } = req.body;
  quantity = parseInt(quantity);
   // Extract userId from the request object set by authenticateJWT

  // console.log('UserId:', userId, 'ProductId:', productId, 'Quantity:', quantity);

  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.get('/',  authorizeRoles('user'), async (req, res) => {

  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.delete('/remove',  authorizeRoles('user'), async (req, res) => {
  const { productId } = req.body;

  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

router.put('/update', authorizeRoles('user'), async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ error: 'Product not found in cart' });
      }
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

export default router;
