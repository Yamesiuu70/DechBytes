import express from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";
import auth from "../middlewares/auth.js"; // <-- your existing middleware

const router = express.Router();

// Use auth middleware to protect the order route
router.post("/", auth, createOrder);

// Fetch logged-in user orders
router.get("/user", auth, getUserOrders);


export default router;
