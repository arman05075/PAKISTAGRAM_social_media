const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Initialize Gemini AI
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log('✅ Gemini AI initialized');
} else {
  console.log('⚠️  Gemini AI not initialized - API key not found');
  console.log('📝 Add GEMINI_API_KEY to .env file to enable AI features');
}

// Generate AI post content
router.post('/generate-post', verifyToken, async (req, res) => {
  try {
    const { prompt, type = 'text' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!model) {
      return res.status(503).json({ error: 'AI service not available. Please configure GEMINI_API_KEY.' });
    }
    
    let systemPrompt = '';
    
    switch (type) {
      case 'code':
        systemPrompt = 'You are a helpful assistant for Pakistani developers. Generate engaging social media posts about programming, tech trends, or coding tips. Keep it concise, informative, and relevant to the Pakistani developer community. Include relevant hashtags.';
        break;
      case 'motivational':
        systemPrompt = 'You are a motivational assistant for Pakistani developers. Create inspiring posts about career growth, learning, and the tech industry in Pakistan. Keep it positive and encouraging.';
        break;
      case 'tech-news':
        systemPrompt = 'You are a tech news assistant. Create posts about latest technology trends, programming languages, or tech industry updates relevant to Pakistani developers.';
        break;
      default:
        systemPrompt = 'You are a helpful assistant for the Pakistani developer community. Generate engaging, relevant social media posts. Keep them concise and include appropriate hashtags.';
    }
    
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate a social media post (max 300 characters):`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedContent = response.text();
    
    res.json({
      content: generatedContent,
      type,
      isAIGenerated: true
    });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Generate AI image prompt suggestions
router.post('/suggest-image-prompts', verifyToken, async (req, res) => {
  try {
    const { postContent } = req.body;
    
    if (!postContent) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (!model) {
      return res.status(503).json({ error: 'AI service not available. Please configure GEMINI_API_KEY.' });
    }
    
    const prompt = `Based on this social media post content, suggest 3 creative, relevant image prompts that would work well with AI image generators like DALL-E or Midjourney. Focus on professional, tech-related, or Pakistani culture themes when appropriate.

Post content: "${postContent}"

Provide 3 image prompt suggestions:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();
    
    res.json({
      suggestions: suggestions.split('\n').filter(s => s.trim().length > 0)
    });
    
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Generate hashtags for posts
router.post('/generate-hashtags', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!model) {
      return res.status(503).json({ error: 'AI service not available. Please configure GEMINI_API_KEY.' });
    }
    
    const prompt = `Generate 5-8 relevant hashtags for this Pakistani developer community post. Include general programming hashtags and Pakistan-specific ones when relevant. Return only the hashtags separated by spaces, starting with #.

Content: "${content}"

Hashtags:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hashtagText = response.text();
    
    const hashtags = hashtagText
      .split(/\s+/)
      .filter(tag => tag.startsWith('#'))
      .slice(0, 8);
    
    res.json({ hashtags });
    
  } catch (error) {
    console.error('Hashtag Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate hashtags' });
  }
});

module.exports = router;