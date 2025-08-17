const Product = require('../models/Product');
const { User } = require('../models/User');
const { generateMultiPlatformPromo } = require('../services/ai');
const { generateImageWithGemini } = require('../services/gemini');
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('../services/cloudinary');

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
    console.log('=== PRODUCT SUBMISSION START ===');
    console.log('Request body:', req.body);
    console.log('Image prompt received:', req.body.imagePrompt);
    
    const { name, description, url, contact, categories, imagePrompt } = req.body;
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

    const productData = {
      name,
      description,
      url,
      contact,
      categories,
      userId,
      multiPlatformContent
    };

    if (imagePrompt && imagePrompt.trim()) {
      productData.imagePrompt = imagePrompt.trim();
    }

    const product = await Product.create(productData);

    let generatedImage = null;
    let imageGenerationError = null;
    
    console.log('Image prompt check:', {
      hasImagePrompt: !!imagePrompt,
      imagePromptValue: imagePrompt,
      imagePromptTrimmed: imagePrompt?.trim(),
      willGenerateImage: !!(imagePrompt && imagePrompt.trim())
    });
    
    if (imagePrompt && imagePrompt.trim()) {
      try {
        console.log('Starting image generation for product:', product._id);
        console.log('Image prompt:', imagePrompt.trim());
        const imageResult = await generateImageWithGemini(imagePrompt.trim());
        
        if (imageResult.success && imageResult.imageData) {
          console.log('Image generated by Gemini, uploading to Cloudinary...');
          
          //Upload to Cloudinary
          const cloudinaryResult = await uploadImageToCloudinary(
            imageResult.imageData,
            imageResult.mimeType,
            imageResult.prompt
          );
          
          if (cloudinaryResult.success) {
            generatedImage = {
              url: cloudinaryResult.url,
              public_id: cloudinaryResult.public_id,
              format: cloudinaryResult.format,
              size: cloudinaryResult.size,
              prompt: cloudinaryResult.prompt,
              generatedAt: new Date()
            };     
            await Product.findByIdAndUpdate(product._id, {
              generatedImage,
              imageGenerationError: null
            });
            
            console.log('Image uploaded to Cloudinary successfully for product:', product._id);
          } 
          else {
            imageGenerationError = 'Failed to upload image to Cloudinary';
            console.log('Cloudinary upload failed:', imageGenerationError);
            await Product.findByIdAndUpdate(product._id, { imageGenerationError });
          }
        } 
        else {
          //Handle case where Gemini returns text instead of image
          imageGenerationError = imageResult.error || 'Image generation completed but no image data received';
          console.log('Image generation issue:', imageGenerationError);
          await Product.findByIdAndUpdate(product._id, { imageGenerationError });
        }
      } 
      catch (imageError) {
        console.error('Image generation/upload failed:', imageError);
        imageGenerationError = imageError.message;
        await Product.findByIdAndUpdate(product._id, { imageGenerationError });
      }
    }

    console.log('=== PRODUCT SUBMISSION END ===');
    console.log('Final response data:', {
      hasGeneratedImage: !!generatedImage,
      hasImageError: !!imageGenerationError,
      imageError: imageGenerationError
    });

    res.json({ 
      success: true, 
      product: {
        ...product.toObject(),
        generatedImage,
        imageGenerationError
      },
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
    } 
    else {
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
  } 
  catch (err) {
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
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const regenerateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { modificationRequest, imageModificationRequest } = req.body;
    const userId = req.user.id;

    if ((!modificationRequest || !modificationRequest.trim()) && (!imageModificationRequest || !imageModificationRequest.trim())) {
      return res.status(400).json({ error: "At least one modification request (text or image) is required" });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to modify this product" });
    }

    //Generate new content with modifications
    let multiPlatformContent = existingProduct.multiPlatformContent;
    if (modificationRequest && modificationRequest.trim()) {
      const rawContent = await generateMultiPlatformPromo({
        name: existingProduct.name,
        description: existingProduct.description,
        url: existingProduct.url,
        contact: existingProduct.contact,
        categories: existingProduct.categories,
        modificationRequest: modificationRequest.trim()
      });
      multiPlatformContent = parseMultiPlatformContent(rawContent);
    }

    //Generate new image with modifications
    let generatedImage = existingProduct.generatedImage;
    let imageGenerationError = null;
    
    if (imageModificationRequest && imageModificationRequest.trim()) {
      try {
        console.log('🎨 Regenerating image for product:', productId);
        console.log('Image modification request:', imageModificationRequest.trim());
        
        const originalPrompt = existingProduct.imagePrompt || 'promotional image';
        const combinedPrompt = `${originalPrompt}. ${imageModificationRequest.trim()}`;
        
        const imageResult = await generateImageWithGemini(combinedPrompt);
        
        if (imageResult.success && imageResult.imageData) {
          console.log('Image regenerated by Gemini, uploading to Cloudinary...');
          
          //Upload to Cloudinary
          const cloudinaryResult = await uploadImageToCloudinary(
            imageResult.imageData,
            imageResult.mimeType,
            combinedPrompt
          );
          
          if (cloudinaryResult.success) {
            //Delete old image from Cloudinary if it exists
            if (existingProduct.generatedImage && existingProduct.generatedImage.public_id) {
              try {
                await deleteImageFromCloudinary(existingProduct.generatedImage.public_id);
                console.log('Old image deleted from Cloudinary:', existingProduct.generatedImage.public_id);
              } catch (deleteError) {
                console.warn('Failed to delete old image from Cloudinary:', deleteError.message);
              }
            }
            
            generatedImage = {
              url: cloudinaryResult.url,
              public_id: cloudinaryResult.public_id,
              format: cloudinaryResult.format,
              size: cloudinaryResult.size,
              prompt: cloudinaryResult.prompt,
              generatedAt: new Date()
            };
            console.log('Image regenerated and uploaded to Cloudinary successfully for product:', productId);
          } 
          else {
            imageGenerationError = 'Failed to upload regenerated image to Cloudinary';
            console.log('Cloudinary upload failed:', imageGenerationError);
          }
        } 
        else {
          imageGenerationError = imageResult.error || 'Image regeneration completed but no image data received';
          console.log('Image regeneration issue:', imageGenerationError);
        }
      } 
      catch (imageError) {
        console.error('Image regeneration/upload failed:', imageError);
        imageGenerationError = imageError.message;
      }
    }

    const updateData = { updatedAt: new Date() };
    
    if (modificationRequest && modificationRequest.trim()) {
      updateData.multiPlatformContent = multiPlatformContent;
    }
    
    if (imageModificationRequest && imageModificationRequest.trim()) {
      updateData.generatedImage = generatedImage;
      updateData.imageGenerationError = imageGenerationError;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    let message = 'Regeneration completed successfully.';
    if (modificationRequest && modificationRequest.trim()) {
      message += ' Content has been regenerated.';
    }
    if (imageModificationRequest && imageModificationRequest.trim()) {
      message += ' Image has been regenerated.';
    }

    res.json({ 
      success: true, 
      message,
      product: updatedProduct
    });
  } 
  catch (err) {
    console.error('Error in regenerateProduct:', err);
    res.status(500).json({ error: err.message });
  }
};

const testImageGeneration = async (req, res) => {
  try {
    const { imagePrompt } = req.body;
    
    if (!imagePrompt || !imagePrompt.trim()) {
      return res.status(400).json({ error: "Image prompt is required" });
    }
    
    console.log('Testing image generation with prompt:', imagePrompt);
    
    const result = await generateImageWithGemini(imagePrompt.trim());
    
    res.json({ 
      success: true, 
      result,
      testPrompt: imagePrompt.trim()
    });
  } 
  catch (err) {
    console.error('Error in testImageGeneration:', err);
    res.status(500).json({ error: err.message });
  }
};

const testCloudinaryConfig = async (req, res) => {
  try {
    const { getCloudinaryStatus } = require('../services/cloudinary');
    const status = getCloudinaryStatus();
    
    res.json({ 
      success: true, 
      cloudinary: status,
      message: status.configured ? 'Cloudinary is properly configured' : 'Cloudinary is not configured'
    });
  } 
  catch (err) {
    console.error('Error in testCloudinaryConfig:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitProduct, getProduct, getProducts, testParsing, regenerateProduct, testImageGeneration, testCloudinaryConfig };
