const express = require('express');
const admin = require('firebase-admin');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Demo data storage
const demoUsers = new Map();

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userQuery = await db.collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    
    if (userQuery.empty) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userQuery.docs[0].data();
    // Remove sensitive data
    delete userData.email;
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName, bio, avatar } = req.body;
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (displayName) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    
    await db.collection('users').doc(userId).update(updateData);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/Unfollow user
router.post('/:username/follow', verifyToken, async (req, res) => {
  try {
    const { username } = req.params;
    const followerId = req.user.uid;
    
    // Get target user
    const targetUserQuery = await db.collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    
    if (targetUserQuery.empty) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const targetUserId = targetUserQuery.docs[0].id;
    
    if (followerId === targetUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const followRef = db.collection('follows').doc(`${followerId}_${targetUserId}`);
    const followDoc = await followRef.get();
    
    if (followDoc.exists) {
      // Unfollow
      await followRef.delete();
      
      // Update counters
      await db.collection('users').doc(followerId).update({
        followingCount: admin.firestore.FieldValue.increment(-1)
      });
      await db.collection('users').doc(targetUserId).update({
        followersCount: admin.firestore.FieldValue.increment(-1)
      });
      
      res.json({ message: 'Unfollowed successfully', following: false });
    } else {
      // Follow
      await followRef.set({
        followerId,
        followingId: targetUserId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update counters
      await db.collection('users').doc(followerId).update({
        followingCount: admin.firestore.FieldValue.increment(1)
      });
      await db.collection('users').doc(targetUserId).update({
        followersCount: admin.firestore.FieldValue.increment(1)
      });
      
      res.json({ message: 'Followed successfully', following: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate and update user level
const updateUserLevel = async (userId) => {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();
  
  const points = userData.levelPoints || 0;
  let newLevel = 'Newcomer';
  
  if (points >= 1000) newLevel = 'Grandmaster';
  else if (points >= 500) newLevel = 'Veteran';
  else if (points >= 100) newLevel = 'Expert';
  else if (points >= 50) newLevel = 'Intermediate';
  else if (points >= 10) newLevel = 'Beginner';
  
  if (newLevel !== userData.level) {
    await db.collection('users').doc(userId).update({ level: newLevel });
  }
};

module.exports = router;