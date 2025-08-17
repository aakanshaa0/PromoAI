const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image data to Cloudinary
 * @param {string} imageData
 * @param {string} mimeType
 * @param {string} prompt
 * @returns {Promise<Object>}
 */
exports.uploadImageToCloudinary = async (imageData, mimeType, prompt) => {
  try {
    console.log('=== CLOUDINARY UPLOAD START ===');
    console.log('MIME type:', mimeType);
    console.log('Prompt:', prompt);
    console.log('Image data length:', imageData?.length || 0);
    
    if (!imageData) {
      throw new Error('Image data is required');
    }
    
    if (!mimeType) {
      throw new Error('MIME type is required');
    }
    
    let base64Data = imageData;
    if (imageData.includes(',')) {
      base64Data = imageData.split(',')[1];
    }
    
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'promo-ai-images',
          public_id: `promo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          context: {
            prompt: prompt || 'AI generated promotional image'
          }
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload successful:', {
              public_id: result.public_id,
              url: result.secure_url,
              format: result.format,
              size: result.bytes
            });
            resolve(result);
          }
        }
      );
      
      const buffer = Buffer.from(base64Data, 'base64');
      uploadStream.end(buffer);
    });
    
    console.log('=== CLOUDINARY UPLOAD END ===');
    
    return {
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      size: uploadResult.bytes,
      prompt: prompt
    };
    
  } catch (error) {
    console.error('ERROR IN CLOUDINARY UPLOAD:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} public_id
 * @returns {Promise<Object>}
 */
exports.deleteImageFromCloudinary = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error('Public ID is required');
    }
    
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Image deleted from Cloudinary:', public_id, result);
    
    return {
      success: true,
      result
    };
    
  } 
  catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Get Cloudinary status
 * @returns {Object}
 */
exports.getCloudinaryStatus = () => {
  const hasConfig = !!(process.env.CLOUDINARY_CLOUD_NAME && 
                       process.env.CLOUDINARY_API_KEY && 
                       process.env.CLOUDINARY_API_SECRET);
  
  return {
    configured: hasConfig,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'Not set',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
  };
};
