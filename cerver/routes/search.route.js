// server/routes/search.route.js
import { Router } from "express";
import { searchProducts } from "../utils/product.db.js";

const router = Router();

/**
 * GET /api/search?q=term
 * Search across all products in all categories
 */
router.get("/", async (req, res) => {
  const query = req.query.q || "";

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const results = await searchProducts(query);

    // Map results to include categorySlug as required by frontend
    const mappedResults = results.map(product => ({
        ...product,
        categorySlug: product.categoryName.toLowerCase() // Assuming categoryName is returned by searchProducts
    }));

    res.json(mappedResults);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
