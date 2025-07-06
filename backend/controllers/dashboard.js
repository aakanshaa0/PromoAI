const Product = require('../models/Product.js');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    //Get all products/posts for the user
    const products = await Product.find({ userId });

    //Calculate stats
    const totalPosts = products.length;
    const totalViews = products.reduce((sum, product) => sum + (product.views || 0), 0);
    const totalUpvotes = products.reduce((sum, product) => sum + (product.upvotes || 0), 0);
    const totalComments = products.reduce((sum, product) => sum + (product.comments || 0), 0);
    
    //Calculate success rate
    const successfulPosts = products.filter(product => 
      (product.upvotes || 0) > 5 || (product.views || 0) > 100
    ).length;
    const successRate = totalPosts > 0 ? Math.round((successfulPosts / totalPosts) * 100) : 0;

    //Get recent posts
    const recentPosts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(product => ({
        id: product._id,
        title: product.name,
        subreddit: product.subreddit || 'r/startups',
        views: product.views || 0,
        upvotes: product.upvotes || 0,
        comments: product.comments || 0,
        status: product.status || 'pending',
        date: product.createdAt,
        redditUrl: product.redditUrl || null
      }));

    res.json({
      totalPosts,
      totalViews,
      totalUpvotes,
      totalComments,
      successRate,
      recentPosts
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = {
  getDashboardData
}; 