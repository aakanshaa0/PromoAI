const Product = require('../models/Product.js');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const products = await Product.find({ userId });

    const totalProducts = products.length;
    const totalContentGenerated = totalProducts * 5;

    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        url: product.url,
        contact: product.contact,
        categories: product.categories,
        createdAt: product.createdAt,
        multiPlatformContent: product.multiPlatformContent
      }));

    res.json({
      totalProducts,
      totalContentGenerated,
      recentProducts
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = {
  getDashboardData
}; 