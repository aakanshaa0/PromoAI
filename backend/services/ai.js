const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

exports.generateMultiPlatformPromo = async (product) => {
  try {
    console.log('AI Service called with product:', product);
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Generate promotional content for a ${product.categories.join('/')} product across multiple platforms. Create engaging, platform-appropriate content for each:

  Product: ${product.name}
  Description: ${product.description}
  URL: ${product.url}
  Contact: ${product.contact || 'Not provided'}

  Generate content for these platforms:

  1. REDDIT POST:
  - Format for r/startups or similar subreddit
  - Include engaging title and post body
  - Be transparent about what you built
  - Ask for feedback and community input
  - Follow Reddit's self-promotion guidelines

  2. TWITTER/X THREAD:
  - Create a 3-5 tweet thread
  - Start with hook, explain problem, solution, call to action
  - Use relevant hashtags naturally
  - Keep each tweet under 280 characters

  3. LINKEDIN POST:
  - Professional tone, business-focused
  - Highlight problem-solution fit
  - Include relevant industry hashtags
  - Professional call to action

  4. INSTAGRAM CAPTION:
  - Engaging opening line
  - Story format about the product
  - Relevant hashtags (5-10)
  - Call to action

  5. EMAIL MARKETING:
  - Subject line and email body
  - Problem-agitate-solution format
  - Clear call to action
  - Professional but friendly tone

  Format the response exactly like this:

  === REDDIT POST ===
  **Title:** [Title here]
  
  [Post body here]

  === TWITTER/X THREAD ===
  Tweet 1: [First tweet]
  Tweet 2: [Second tweet]
  Tweet 3: [Third tweet]
  Tweet 4: [Fourth tweet]

  === LINKEDIN POST ===
  [LinkedIn post content]

  === INSTAGRAM CAPTION ===
  [Instagram caption with hashtags]

  === EMAIL MARKETING ===
  Subject: [Subject line]
  
  [Email body content]

  IMPORTANT: 
  - Generate actual content, not instructions
  - Use clean URLs like "example.com" instead of "https://www.example.com"
  - Be genuine and add real value
  - Sound like a real person sharing their story
  - Focus on community benefit, not just self-promotion
  - Make each platform version unique and appropriate`;

    console.log('Sending prompt to AI...');
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    console.log('AI Response received, length:', response.length);
    console.log('AI Response preview:', response.substring(0, 200) + '...');
    
    return response;
  } 
  catch (error) {
    console.error('Error in AI service:', error);
    throw new Error(`AI service failed: ${error.message}`);
  }
};
