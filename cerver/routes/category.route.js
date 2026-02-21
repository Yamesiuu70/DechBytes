import express from 'express';
import { getAllCategories, getCategoryById } from '../controllers/category.controller.js';
import { findProductsByCategoryId } from '../utils/product.db.js';
import { findCategoryByName } from '../utils/category.db.js';

const router = express.Router();

// GET all categories
router.get('/', getAllCategories);

// GET products by category name
router.get('/:categoryName/products', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await findCategoryByName(categoryName);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }
    
    const products = await findProductsByCategoryId(category.id);
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch products by category error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET category by ID (must be last to avoid conflicts)
router.get('/:id', getCategoryById);

export default router;