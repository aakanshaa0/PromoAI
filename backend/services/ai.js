const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generatePromo = async (product) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `Create a Reddit-friendly post for a ${product.categories.join('/')} product. Follow these Reddit promotion best practices:

  Product: ${product.name}
  Description: ${product.description}
  URL: ${product.url}

  Requirements:
  - Write a title that's engaging but not promotional
  - Focus on seeking feedback and community input, not selling
  - Mention the problem you were trying to solve
  - Present it as something you built/created
  - Ask for honest feedback and thoughts
  - Mention it's free/beta if applicable
  - Be humble and community-focused
  - Include a polite note to mods if needed
  - Keep it conversational and genuine
  🔑 REDDIT PROMOTION BEST PRACTICES:
  - Be transparent — avoid sounding like a marketer
  - Ask for feedback or input, not just clicks
  - Add value or share your story — don't just drop a link
  - Offer something free if you can (beta access, resource, etc.)
  - Read subreddit rules before posting (mention this)
  
  POST STRUCTURE:
  - Start with a personal story or problem you solved
  - Be transparent about what you built
  - Share your journey/experience
  - Ask for genuine feedback and input
  - Offer something free (beta access, demo, etc.)
  - Include the URL naturally in context
  - Be humble and community-focused
  - Mention checking subreddit rules

  Write the post content directly in this format:
  
  **Title:** [Transparent, value-focused title]
  
  [Personal story → Problem you solved → What you built → Value you're offering → Ask for feedback → Include URL naturally]
  
  [Optional: Mention checking subreddit rules or offering free access]
  
  IMPORTANT: 
  - Generate the actual post content, not instructions or placeholders
  - Use clean URLs like "example.com" instead of "https://www.example.com"
  - Reddit will automatically make URLs clickable
  - Be transparent and add real value
  - Sound like a real person sharing their story
  - Focus on community benefit, not self-promotion`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};
