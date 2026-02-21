import { Router } from "express";
import auth from "../middlewares/auth.js";
import { 
    addCartProduct, 
    updateCartProductQuantity, 
    deleteCartProductById,
    getCartProductById,
    getCartWithProductDetails,
    getCartItemByUserAndProduct
} from "../utils/cart.db.js";

const cartRouter = Router();

// ============================================
// ADD ITEM TO CART
// POST /api/cart/add
// ============================================
cartRouter.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    console.log(`Add to cart - User: ${userId}, Product: ${productId}, Quantity: ${quantity}`);

    // Validation
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const parsedProductId = parseInt(productId);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product already exists in cart
    const existingCartItem = await getCartItemByUserAndProduct(userId, parsedProductId);

    if (existingCartItem) {
      // Update quantity if exists
      const newQuantity = existingCartItem.quantity + quantity;
      await updateCartProductQuantity(existingCartItem.id, newQuantity);
      
      return res.json({ 
        success: true, 
        message: "Cart updated successfully",
        cartItem: { 
          id: existingCartItem.id, 
          productId: parsedProductId,
          quantity: newQuantity 
        }
      });
    }

    // Add new item
    const result = await addCartProduct({ 
      userId, 
      productId: parsedProductId, 
      quantity 
    });
    
    return res.json({ 
      success: true, 
      message: "Product added to cart successfully",
      cartItem: { 
        id: result.id, 
        productId: parsedProductId,
        quantity 
      }
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// GET CART ITEMS
// GET /api/cart
// ============================================
cartRouter.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    console.log(`Fetching cart for user: ${userId}`);
    
    // Get cart with product details
    const cartItems = await getCartWithProductDetails(userId);
    
    console.log(`Found ${cartItems.length} items in cart`);
    
    // Format for frontend (match frontend expectations)
    const formattedCart = cartItems.map(item => ({
      _id: item.cart_id,
      productId: item.productId,
      quantity: item.quantity,
      userId: item.userId,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: {
        id: item.product_id,
        name: item.product_name || 'Unknown Product',
        price: item.product_price || 0,
        photo: item.product_photo || '',
        details: item.product_details || '',
        categoryId: item.product_categoryId
      }
    }));

    res.json({ 
      success: true, 
      cart: formattedCart 
    });
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// UPDATE QUANTITY
// PUT /api/cart/update/:itemId
// ============================================
cartRouter.put("/update/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    console.log(`Update quantity - Item: ${itemId}, New Quantity: ${quantity}, User: ${userId}`);

    // Validation
    if (!itemId || itemId === 'undefined' || itemId === 'null') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid item ID" 
      });
    }

    const parsedItemId = parseInt(itemId);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Item ID must be a number" 
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Quantity must be >= 1" 
      });
    }

    // Check if item exists
    const cartItem = await getCartProductById(parsedItemId);
    
    if (!cartItem) {
      console.log(`Cart item ${parsedItemId} not found`);
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found" 
      });
    }

    // Verify ownership
    if (cartItem.userId !== userId) {
      console.log(`User ${userId} tried to update item belonging to user ${cartItem.userId}`);
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized - This item does not belong to you" 
      });
    }

    // Update quantity
    await updateCartProductQuantity(parsedItemId, quantity);
    
    console.log(`Successfully updated cart item ${parsedItemId} to quantity ${quantity}`);
    res.json({ 
      success: true, 
      message: "Cart item quantity updated successfully" 
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// DELETE ITEM FROM CART
// DELETE /api/cart/delete/:itemId
// ============================================
cartRouter.delete("/delete/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.userId;

    console.log(`Delete request received - Item ID: ${itemId}, User ID: ${userId}`);

    // Validation
    if (!itemId || itemId === 'undefined' || itemId === 'null') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid item ID" 
      });
    }

    const parsedItemId = parseInt(itemId);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Item ID must be a number" 
      });
    }

    // Check if item exists
    const cartItem = await getCartProductById(parsedItemId);
    
    if (!cartItem) {
      console.log(`Cart item ${parsedItemId} not found`);
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found" 
      });
    }

    // Verify ownership
    if (cartItem.userId !== userId) {
      console.log(`User ${userId} tried to delete item belonging to user ${cartItem.userId}`);
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized - This item does not belong to you" 
      });
    }

    // Delete the item
    console.log(`Attempting to delete cart item ${parsedItemId}`);
    const deleted = await deleteCartProductById(parsedItemId);
    
    if (deleted) {
      console.log(`Successfully deleted cart item ${parsedItemId}`);
      res.json({ 
        success: true, 
        message: "Item removed from cart successfully" 
      });
    } else {
      console.log(`Failed to delete cart item ${parsedItemId}`);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete item" 
      });
    }
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default cartRouter;