import { Router } from "express";
import { findCategoryByName } from "../utils/category.db.js";
import { findProductByIdAndCategoryId, searchProducts, getProductById } from "../utils/product.db.js";

const router = Router();

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await searchProducts(''); // Returns all products
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch all products error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ NEW: Get product by ID only (এই route টা আগে রাখতে হবে)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID" 
      });
    }

    const product = await getProductById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({ success: true, data: product });
  } catch (err) {
    console.error("Fetch product by ID error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product by category slug and product ID
router.get("/:categorySlug/:productId", async (req, res) => {
  const { categorySlug, productId } = req.params;

  try {
    const category = await findCategoryByName(categorySlug);

    if (!category)
      return res.status(404).json({ 
        success: false, 
        message: "Unknown product category!" 
      });

    const product = await findProductByIdAndCategoryId(productId, category.id);

    if (!product) 
      return res.status(404).json({ 
        success: false, 
        message: "Product not found!" 
      });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;