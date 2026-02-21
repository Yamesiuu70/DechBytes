import { createOrder as createOrderDb, findUserOrders } from "../utils/order.db.js";
import { deleteCartProductsByUserId } from "../utils/cart.db.js";
import { findUserById } from "../utils/user.db.js";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async (req, res) => {
  try {
    const { products, delivery_address, subTotalAmt, totalAmt } = req.body;
    const userId = req.userId; // from auth middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Products are required" });
    }

    if (
      !delivery_address ||
      !delivery_address.name ||
      !delivery_address.email ||
      !delivery_address.phone ||
      !delivery_address.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required",
      });
    }

    // 1️⃣ Create order
    const newOrder = await createOrderDb({
      userId,
      orderId: uuidv4(),
      payment_status: "pending",
      delivery_address, // Pass embedded object for now, createOrder function will parse it
      subTotalAmt,
      totalAmt,
      invoice_receipt: "" // Default empty
    }, products);

    // 2️⃣ Clear user's cart collection
    await deleteCartProductsByUserId(userId);

    // 3️⃣ User update logic (shopping_cart and orderHistory are relational now)
    // No direct update to Users table needed for shopping_cart or orderHistory arrays
    // as these are handled by separate tables and foreign keys in MSSQL.
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully, cart cleared, and order saved to history",
      data: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * Get all orders of the logged-in user
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Fetch orders for this user, sorted by newest first
    const userOrders = await findUserOrders(userId);

    res.status(200).json({
      success: true,
      orders: userOrders,
    });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};