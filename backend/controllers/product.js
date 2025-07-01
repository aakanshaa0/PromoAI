const Product = require('../models/Product');
const { generatePromo } = require('../services/ai');
const { postToReddit } = require('../services/reddit');

const submitProduct = async (req, res) => {
  try {
    const { name, description, url, categories } = req.body;
    const userId = req.userId;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: "At least one category is required" });
    }

    const user = await User.findById(userId);
    if (!user.redditRefreshToken) {
      return res.status(403).json({ error: "User has not connected Reddit account" });
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

    const postResults = await postToReddit(
      {
        title: `${name} - ${description.substring(0, 50)}...`,
        url,
        description: promoText
      },
      categories,
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
      product,
      postResults
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitProduct };
