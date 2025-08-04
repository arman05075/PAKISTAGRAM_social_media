const express = require('express');
const router = express.Router();

// Simple demo endpoints that work without Firebase
router.get('/status', (req, res) => {
  res.json({
    message: 'Pakistagram API is running in demo mode! 🇵🇰',
    firebaseInitialized: req.firebaseInitialized || false,
    features: {
      authentication: 'Demo mode',
      posts: 'Demo mode',
      ai: 'Limited (requires OpenAI key)',
    }
  });
});

module.exports = router;