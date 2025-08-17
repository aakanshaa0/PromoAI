const { GoogleGenAI, Modality } = require("@google/genai");

exports.generateImageWithGemini = async (imagePrompt) => {
  try {
    console.log('=== GEMINI IMAGE GENERATION START ===');
    console.log('Prompt:', imagePrompt);
    console.log('API Key exists:', !!process.env.GOOGLE_AI_API_KEY);
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    
    if (!imagePrompt || !imagePrompt.trim()) {
      throw new Error('Image prompt is required');
    }
    
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY
    });
    
    console.log('Google GenAI SDK initialized successfully');
    
    const model = "gemini-2.0-flash-preview-image-generation";
    
    console.log('Using model:', model);
    console.log('API Key length:', process.env.GOOGLE_AI_API_KEY?.length || 0);
    
    const prompt = `Generate a high-quality promotional image based on this description: ${imagePrompt.trim()}

Requirements:
- Professional, marketing-ready image
- High resolution and quality
- Suitable for promotional materials
- Clear, engaging visual composition
- Brand-friendly and professional appearance

Please create an image that would be perfect for promoting this product or service.`;

    console.log('Sending request to Gemini with model:', model);
    console.log('Prompt length:', prompt.length);
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    
    console.log('=== GEMINI RESPONSE RECEIVED ===');
    console.log('Response structure:', {
      hasCandidates: !!response.candidates,
      candidateCount: response.candidates?.length || 0,
      responseType: typeof response,
      responseKeys: Object.keys(response || {})
    });
    
    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      const content = response.candidates[0].content;
      console.log('Content structure:', {
        hasParts: !!content.parts,
        partsCount: content.parts?.length || 0,
        contentKeys: Object.keys(content || {})
      });
      
      if (content.parts && content.parts.length > 0) {
        console.log('Processing content parts...');
        for (let i = 0; i < content.parts.length; i++) {
          const part = content.parts[i];
          console.log(`Part ${i}:`, {
            hasText: !!part.text,
            hasInlineData: !!part.inlineData,
            mimeType: part.inlineData?.mimeType,
            partKeys: Object.keys(part || {})
          });
          
          if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
            console.log('IMAGE DATA FOUND!', {
              mimeType: part.inlineData.mimeType,
              dataLength: part.inlineData.data?.length || 0
            });
            
            return {
              success: true,
              imageData: part.inlineData.data,
              mimeType: part.inlineData.mimeType,
              prompt: imagePrompt.trim()
            };
          }
        }
      }
      
      if (content.parts && content.parts.length > 0) {
        const textParts = content.parts.filter(part => part.text).map(part => part.text);
        if (textParts.length > 0) {
          console.log('No image generated, but got text response:', textParts.join(' '));
          return {
            success: false,
            error: 'No image was generated. Gemini returned text only.',
            textResponse: textParts.join(' '),
            prompt: imagePrompt.trim()
          };
        }
      }
    }
    
    console.log('No valid response structure found');
    console.log('Full response:', JSON.stringify(response, null, 2));
    throw new Error('No valid response received from Gemini');
    
  } 
  catch (error) {
    console.error('ERROR IN GEMINI IMAGE GENERATION:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Gemini image generation failed: ${error.message}`);
  } 
  finally {
    console.log('=== GEMINI IMAGE GENERATION END ===');
  }
};
