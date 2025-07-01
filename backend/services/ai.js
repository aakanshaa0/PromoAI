const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generatePromo = async (product) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `Create a Reddit post for a ${product.categories.join('/')} product:
  
  Product: ${product.name}
  Description: ${product.description}
  URL: ${product.url}

  Requirements:
  - Write a compelling title (max 100 chars)
  - Create engaging post text (max 300 chars)
  - Include 2-3 relevant hashtags
  - Use a casual but professional tone
  - Mention the product name and key features
  - Include a call-to-action

  Format:
  Title: [Your title here]
  Text: [Your post text here]`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};
