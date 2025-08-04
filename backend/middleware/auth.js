const admin = require('firebase-admin');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    if (!req.firebaseInitialized) {
      // Demo mode - extract user ID from token (this is just for demo)
      const demoUserId = token.split('.')[0]; // Simple demo token parsing
      req.user = { uid: demoUserId };
      next();
      return;
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };