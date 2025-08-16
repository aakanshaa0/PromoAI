const Product = require('../models/Product');
const { User } = require('../models/User');
const { generateMultiPlatformPromo } = require('../services/ai');

const parseMultiPlatformContent = (rawContent) => {
  console.log('Raw AI content length:', rawContent.length);
  
  const content = {
    reddit: { title: '', post: '' },
    twitter: { thread: [] },
    linkedin: '',
    instagram: '',
    email: { subject: '', body: '' }
  };

  try {
    const sections = rawContent.split('===').filter(section => section.trim().length > 0);
    console.log('Parsed sections count:', sections.length);
    
    for (let i = 0; i < sections.length - 1; i++) {
      const headerSection = sections[i].trim();
      const contentSection = sections[i + 1].trim();
      
      console.log(`Processing section ${i}: Header="${headerSection}", Content length=${contentSection.length}`);
      
      if (headerSection.includes('REDDIT POST')) {
        console.log('Found REDDIT POST section');

        const titleMatch = contentSection.match(/\*\*Title:\*\* (.+)/);
        if (titleMatch) {
          content.reddit.title = titleMatch[1].trim();
          content.reddit.post = contentSection.replace(/\*\*Title:\*\* .+/, '').trim();
          console.log('Reddit title found:', content.reddit.title);
        } else {
          console.log('No title match found, using fallback');

          const lines = contentSection.split('\n').filter(line => line.trim().length > 0);
          if (lines.length > 0) {
            content.reddit.title = lines[0].trim();
            content.reddit.post = lines.slice(1).join('\n').trim();
            console.log('Reddit fallback title:', content.reddit.title);
          }
        }
      }
      
      else if (headerSection.includes('TWITTER/X THREAD')) {
        console.log('Found TWITTER/X THREAD section');
        const tweets = contentSection.split('\n').filter(line => line.trim().startsWith('Tweet'));
        if (tweets.length > 0) {
          content.twitter.thread = tweets.map(tweet => tweet.replace(/^Tweet \d+:\s*/, '').trim());
          console.log('Twitter tweets found:', content.twitter.thread.length);
        } 
        else {
          console.log('No tweet format found, using fallback');
          const lines = contentSection.split('\n').filter(line => line.trim().length > 0);
          content.twitter.thread = lines.slice(0, 5);
          console.log('Twitter fallback lines:', content.twitter.thread.length);
        }
      }
      
      else if (headerSection.includes('LINKEDIN POST')) {
        console.log('Found LINKEDIN POST section');
        content.linkedin = contentSection;
        console.log('LinkedIn content length:', content.linkedin.length);
      }
      
      else if (headerSection.includes('INSTAGRAM CAPTION')) {
        console.log('Found INSTAGRAM CAPTION section');
        content.instagram = contentSection;
        console.log('Instagram content length:', content.instagram.length);
      }
      
      else if (headerSection.includes('EMAIL MARKETING')) {
        console.log('Found EMAIL MARKETING section');
        const subjectMatch = contentSection.match(/Subject:\s*(.+)/);
        if (subjectMatch) {
          content.email.subject = subjectMatch[1].trim();
          content.email.body = contentSection.replace(/Subject:\s*.+/, '').trim();
          console.log('Email subject found:', content.email.subject);
        } 
        else {
          console.log('No subject match found, using fallback');

          const lines = contentSection.split('\n').filter(line => line.trim().length > 0);
          if (lines.length > 0) {
            content.email.subject = lines[0].trim();
            content.email.body = lines.slice(1).join('\n').trim();
            console.log('Email fallback subject:', content.email.subject);
          }
        }
      }
    }
    
  } 
  catch (error) {
    console.error('Error parsing content:', error);
  }

  console.log('Final parsed content:', JSON.stringify(content, null, 2));
  return content;
};

const testParsing = (req, res) => {
  try {
    const testContent = `=== REDDIT POST ===
**Title:** Building a Better Video Platform: Seeking Your Brutally Honest Feedback!

Hey r/startups! We're building YouTube, a platform designed to foster genuine connection through video.

=== TWITTER/X THREAD ===
Tweet 1: Tired of algorithm changes & opaque monetization on video platforms?
Tweet 2: Problem: Existing platforms prioritize profit over creator wellbeing.

=== LINKEDIN POST ===
The video content creation landscape is constantly evolving, but one thing remains consistent.

=== INSTAGRAM CAPTION ===
Imagine a world where creators are truly empowered. ✨ That's the vision behind YouTube!

=== EMAIL MARKETING ===
Subject: Frustrated with Video Platforms? There's a Better Way.

Hi [Name], Are you tired of battling constantly changing algorithms?`;

    const parsed = parseMultiPlatformContent(testContent);
    res.json({ 
      success: true, 
      testContent,
      parsed,
      sections: testContent.split('===').filter(s => s.trim().length > 0)
    });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitProduct = async (req, res) => {
  try {
    const { name, description, url, contact, categories } = req.body;
    const userId = req.user.id;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: "At least one category is required" });
    }

    const rawContent = await generateMultiPlatformPromo({ 
      name, 
      description, 
      url, 
      contact,
      categories
    });

    const multiPlatformContent = parseMultiPlatformContent(rawContent);

    const product = await Product.create({
      name,
      description,
      url,
      contact,
      categories,
      userId,
      multiPlatformContent
    });

    res.json({ 
      success: true, 
      product,
      rawContent
    });
  } 
  catch (err) {
    console.error('Error in submitProduct:', err);
    res.status(500).json({ error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let product;
    if (productId === 'latest') {
      product = await Product.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to access this product" });
    }

    res.json({ 
      success: true, 
      product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ userId }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitProduct, getProduct, getProducts, testParsing };
