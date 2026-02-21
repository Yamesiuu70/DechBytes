import express from 'express';
import { addProductToCart, getUserCart, updateCartItemQuantity, deleteCartItem } from '../controllers/cart.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Add item to cart
router.post('/add', auth, addProductToCart);

// Get cart items for logged-in user
router.get('/', auth, getUserCart);

// Update quantity of a cart item
router.put('/update/:itemId', auth, updateCartItemQuantity);

// Delete item from cart
router.delete('/delete/:itemId', auth, deleteCartItem);

export default router;