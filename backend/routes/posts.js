const express = require('express');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Demo data storage
const demoPosts = new Map();
const demoComments = new Map();

// Create a new post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, imageUrl, tags, isAIGenerated } = req.body;
    const userId = req.user.uid;
    
    const postId = uuidv4();
    const post = {
      id: postId,
      userId,
      content,
      imageUrl: imageUrl || '',
      tags: tags || [],
      isAIGenerated: isAIGenerated || false,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (!req.firebaseInitialized) {
      // Demo mode
      demoPosts.set(postId, post);
      res.status(201).json({ message: 'Post created successfully (Demo Mode)', post });
      return;
    }
    
    // Real Firebase mode
    post.createdAt = admin.firestore.FieldValue.serverTimestamp();
    post.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await req.db.collection('posts').doc(postId).set(post);
    
    // Update user's post count and level points
    await req.db.collection('users').doc(userId).update({
      postsCount: admin.firestore.FieldValue.increment(1),
      levelPoints: admin.firestore.FieldValue.increment(isAIGenerated ? 5 : 10)
    });
    
    // Update user level
    await updateUserLevel(userId, req.db);
    
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts feed
router.get('/feed', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.uid;
    
    if (!req.firebaseInitialized) {
      // Demo mode - return sample posts
      const samplePosts = [
        {
          id: '1',
          content: 'Welcome to Pakistagram! 🇵🇰 This is where Pakistani developers connect and share their journey.',
          user: {
            displayName: 'Pakistagram Team',
            username: 'pakistagram',
            level: 'Grandmaster',
            avatar: '',
          },
          likesCount: 42,
          commentsCount: 8,
          isLiked: false,
          isAIGenerated: false,
          createdAt: new Date(),
        }
      ];
      
      // Add demo posts
      const demoPostsArray = Array.from(demoPosts.values());
      const allPosts = [...demoPostsArray, ...samplePosts];
      
      res.json({ posts: allPosts, page: parseInt(page) });
      return;
    }
    
    // Real Firebase mode
    const followingQuery = await req.db.collection('follows')
      .where('followerId', '==', userId)
      .get();
    
    const followingIds = followingQuery.docs.map(doc => doc.data().followingId);
    followingIds.push(userId); // Include user's own posts
    
    // Get posts from followed users
    let postsQuery = req.db.collection('posts')
      .where('userId', 'in', followingIds.slice(0, 10)) // Firestore limit
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));
    
    const postsSnapshot = await postsQuery.get();
    const posts = [];
    
    for (const doc of postsSnapshot.docs) {
      const postData = doc.data();
      
      // Get user info
      const userDoc = await req.db.collection('users').doc(postData.userId).get();
      const userData = userDoc.data();
      
      posts.push({
        ...postData,
        user: {
          username: userData.username,
          displayName: userData.displayName,
          avatar: userData.avatar,
          level: userData.level
        }
      });
    }
    
    res.json({ posts, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike a post
router.post('/:postId/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;
    
    const likeRef = db.collection('likes').doc(`${userId}_${postId}`);
    const likeDoc = await likeRef.get();
    
    if (likeDoc.exists) {
      // Unlike
      await likeRef.delete();
      await db.collection('posts').doc(postId).update({
        likesCount: admin.firestore.FieldValue.increment(-1)
      });
      
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      await likeRef.set({
        userId,
        postId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      await db.collection('posts').doc(postId).update({
        likesCount: admin.firestore.FieldValue.increment(1)
      });
      
      // Award points to post author
      const postDoc = await db.collection('posts').doc(postId).get();
      const postData = postDoc.data();
      
      await db.collection('users').doc(postData.userId).update({
        levelPoints: admin.firestore.FieldValue.increment(1)
      });
      
      await updateUserLevel(postData.userId);
      
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to post
router.post('/:postId/comments', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;
    
    const commentId = uuidv4();
    const comment = {
      id: commentId,
      postId,
      userId,
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('comments').doc(commentId).set(comment);
    
    // Update post comment count
    await db.collection('posts').doc(postId).update({
      commentsCount: admin.firestore.FieldValue.increment(1)
    });
    
    // Award points to commenter and post author
    await db.collection('users').doc(userId).update({
      levelPoints: admin.firestore.FieldValue.increment(2)
    });
    
    const postDoc = await db.collection('posts').doc(postId).get();
    const postData = postDoc.data();
    
    if (postData.userId !== userId) {
      await db.collection('users').doc(postData.userId).update({
        levelPoints: admin.firestore.FieldValue.increment(1)
      });
      await updateUserLevel(postData.userId);
    }
    
    await updateUserLevel(userId);
    
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const commentsQuery = await db.collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const comments = [];
    
    for (const doc of commentsQuery.docs) {
      const commentData = doc.data();
      
      // Get user info
      const userDoc = await db.collection('users').doc(commentData.userId).get();
      const userData = userDoc.data();
      
      comments.push({
        ...commentData,
        user: {
          username: userData.username,
          displayName: userData.displayName,
          avatar: userData.avatar,
          level: userData.level
        }
      });
    }
    
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user level helper function
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