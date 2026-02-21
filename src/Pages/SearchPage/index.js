import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`http://localhost:5001/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Search failed");
        }

        // Check the actual response structure
        console.log("Search results:", data);

        // Handle different response formats
        let products = [];
        if (data.success && Array.isArray(data.products)) {
          products = data.products;
        } else if (Array.isArray(data)) {
          products = data;
        }

        // Format results for frontend
        const formattedResults = products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          photo: product.photo,
          details: product.details,
          categoryName: product.categoryName || '',
          // Create category slug from category name
          categorySlug: (product.categoryName || '').toLowerCase()
        }));

        setResults(formattedResults);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleProductClick = (product) => {
    // Category slug mapping
    const categoryMap = {
      'arms': 'arms',
      'legs': 'legs',
      'laptops': 'laptops',
      'desktops': 'desktops',
      'electronics': 'electronics',
      'featured': 'featured'
    };

    // Get category slug (default to 'products' if not found)
    const categorySlug = categoryMap[product.categorySlug] || 'products';
    
    // Navigate to product detail page with correct ID
    navigate(`/product/${categorySlug}/${product.id}`);
  };

  if (!query) {
    return (
      <div className="search-page container">
        <h2>Search Products</h2>
        <p>Type something in the search bar to find products</p>
      </div>
    );
  }

  return (
    <div className="search-page container">
      <h2>Search Results for: "{query}"</h2>
      
      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && results.length === 0 && (
        <p className="no-results">No products found matching "{query}"</p>
      )}

      <ul className="search-results-list">
        {results.map((product) => (
          <li
            key={product.id}
            className="search-result-item"
            style={{ cursor: "pointer" }}
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.photo || '/placeholder.jpg'}
              alt={product.name}
              className="search-result-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
              }}
            />
            <div className="search-result-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price?.toFixed(2) || '0.00'}</p>
              <p className="category">{product.categoryName}</p>
              <p className="details">{product.details?.substring(0, 100)}...</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}