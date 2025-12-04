// In your backend routes file (e.g., routes/search.js)
import express from 'express';
const router = express.Router();
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Subcategory from '../models/SubCategory.js';

router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const searchQuery = { $regex: query, $options: 'i' };

    const [products, categories, subcategories] = await Promise.all([
      Product.find({
        $or: [
          { name: searchQuery },
          { description: searchQuery }
        ]
      }).limit(5).lean(),
      Category.find({ name: searchQuery }).limit(3).lean(),
      Subcategory.find({ name: searchQuery }).limit(3).lean()
    ]);

    const results = [
      ...products.map(p => ({ ...p, type: 'product' })),
      ...categories.map(c => ({ ...c, type: 'category' })),
      ...subcategories.map(s => ({ ...s, type: 'subcategory' }))
    ];

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aMatch = a.name.toLowerCase() === query.toLowerCase() ? 0 : 1;
      const bMatch = b.name.toLowerCase() === query.toLowerCase() ? 0 : 1;
      return aMatch - bMatch;
    });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search' });
  }
});

export default router;