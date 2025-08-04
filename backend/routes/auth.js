const express = require('express');
const admin = require('firebase-admin');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Demo user data for when Firebase is not initialized
const demoUsers = new Map();

// Create user profile after authentication
router.post('/create-profile', verifyToken, async (req, res) => {
  try {
    const { username, displayName, bio } = req.body;
    const userId = req.user.uid;
    
    if (!req.firebaseInitialized) {
      // Demo mode
      if (demoUsers.has(username)) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      
      const userProfile = {
        uid: userId,
        username,
        displayName,
        bio: bio || '',
        avatar: '',
        level: 'Newcomer',
        levelPoints: 0,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      demoUsers.set(userId, userProfile);
      demoUsers.set(username, userProfile); // Also store by username for lookup
      
      res.status(201).json({ 
        message: 'Profile created successfully (Demo Mode)',
        user: userProfile 
      });
      return;
    }
    
    // Check if username is taken
    const usernameQuery = await req.db.collection('users')
      .where('username', '==', username)
      .get();
    
    if (!usernameQuery.empty) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    const userProfile = {
      uid: userId,
      username,
      displayName,
      bio: bio || '',
      avatar: '',
      level: 'Newcomer',
      levelPoints: 0,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await req.db.collection('users').doc(userId).set(userProfile);
    
    res.status(201).json({ 
      message: 'Profile created successfully',
      user: userProfile 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    if (!req.firebaseInitialized) {
      // Demo mode
      const userProfile = demoUsers.get(userId);
      if (!userProfile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(userProfile);
      return;
    }
    
    const userDoc = await req.db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;