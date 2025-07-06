const Product = require('../models/Product');
const { User } = require('../models/User');
const { generatePromo } = require('../services/ai');
const { postToReddit } = require('../services/reddit');

const submitProduct = async (req, res) => {
  try {
    const { name, description, url, categories } = req.body;
    const userId = req.userId;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: "At least one category is required" });
    }

    const promoText = await generatePromo({ 
      name, 
      description, 
      url, 
      categories
    });

    const product = await Product.create({
      name,
      description,
      url,
      categories,
      userId,
      promoText
    });

    res.json({ 
      success: true, 
      product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const promoteProduct = async (req, res) => {
  try {
    const { productId, categories } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user.redditRefreshToken) {
      return res.status(403).json({ error: "User has not connected Reddit account" });
    }

    // Get the product (either by ID or the latest one)
    let product;
    if (productId === 'latest') {
      product = await Product.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const postResults = await postToReddit(
      {
        title: `${product.name} - ${product.description.substring(0, 50)}...`,
        url: product.url,
        description: product.promoText
      },
      categories || product.categories,
      user.redditRefreshToken
    );

    product.postedToReddit = postResults.success;
    product.redditSubmissions = postResults.results
      .filter(r => r.status === 'success')
      .map(r => ({
        subreddit: r.subreddit,
        submissionId: r.submissionId,
        url: r.submissionUrl
      }));
    
    await product.save();

    res.json({ 
      success: true, 
      postResults
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitProduct, promoteProduct };
