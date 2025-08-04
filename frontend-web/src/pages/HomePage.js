import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  CardActions,
  CardHeader,
  Collapse,
  InputAdornment,
} from '@mui/material';
import {
  CameraAlt,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Add,
  AutoAwesome,
  Logout,
  Search,
  Home,
  Person,
  MoreVert,
  Send,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const { userProfile, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [aiMode, setAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    loadFeed();
    loadSuggestedUsers();
  }, []);

  const loadFeed = async () => {
    try {
      // Create sample posts with real user data
      const samplePosts = [
        {
          id: '1',
          content: 'Just deployed my first React app with Firebase! 🚀 The feeling is incredible. Pakistani developers are making waves in tech! #ReactJS #Firebase #PakistaniDevelopers #WebDev',
          user: {
            displayName: 'Ahmed Khan',
            username: 'ahmed_dev',
            level: 'Expert',
            avatar: '',
            uid: 'user1'
          },
          likesCount: 24,
          commentsCount: 8,
          isLiked: false,
          isAIGenerated: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          comments: [
            {
              id: 'c1',
              content: 'Congratulations! Keep building amazing things! 🎉',
              user: { displayName: 'Sara Ali', username: 'sara_codes' },
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: '2',
          content: '🤖 AI-Generated: Exploring the latest trends in machine learning and how Pakistani developers can leverage AI to build innovative solutions. The future is bright for tech in Pakistan! #AI #MachineLearning #TechPakistan #Innovation',
          user: {
            displayName: 'Fatima Sheikh',
            username: 'fatima_ai',
            level: 'Veteran',
            avatar: '',
            uid: 'user2'
          },
          likesCount: 42,
          commentsCount: 15,
          isLiked: true,
          isAIGenerated: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          comments: []
        },
        {
          id: '3',
          content: 'Working on a new Flutter app for local businesses in Karachi. Love how Flutter makes cross-platform development so smooth! Any other Flutter devs here? #Flutter #MobileDev #Karachi #CrossPlatform',
          user: {
            displayName: 'Hassan Malik',
            username: 'hassan_flutter',
            level: 'Intermediate',
            avatar: '',
            uid: 'user3'
          },
          likesCount: 18,
          commentsCount: 6,
          isLiked: false,
          isAIGenerated: false,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          comments: []
        }
      ];
      
      setPosts(samplePosts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading feed:', error);
      setLoading(false);
    }
  };

  const loadSuggestedUsers = () => {
    const users = [
      { displayName: 'Ali Raza', username: 'ali_backend', level: 'Expert', followers: 234 },
      { displayName: 'Zara Ahmed', username: 'zara_frontend', level: 'Veteran', followers: 456 },
      { displayName: 'Omar Khan', username: 'omar_fullstack', level: 'Grandmaster', followers: 789 },
      { displayName: 'Ayesha Malik', username: 'ayesha_mobile', level: 'Intermediate', followers: 123 },
    ];
    setSuggestedUsers(users);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      const token = await currentUser?.getIdToken();
      
      if (aiMode && aiPrompt.trim()) {
        // Call real AI API
        const aiResponse = await axios.post(`${API_BASE_URL}/ai/generate-post`, {
          prompt: aiPrompt,
          type: 'code'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (aiResponse.data.content) {
          setPostContent(aiResponse.data.content);
          setAiPrompt('');
          return;
        }
      }

      const newPost = {
        id: Date.now().toString(),
        content: postContent,
        user: {
          displayName: userProfile?.displayName || 'You',
          username: userProfile?.username || 'you',
          level: userProfile?.level || 'Newcomer',
          avatar: userProfile?.avatar || '',
          uid: currentUser?.uid
        },
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isAIGenerated: aiMode,
        createdAt: new Date(),
        comments: []
      };

      setPosts([newPost, ...posts]);
      setPostContent('');
      setAiPrompt('');
      setCreatePostOpen(false);
      setAiMode(false);
    } catch (error) {
      setError('Failed to create post');
    }
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim()) return;

    try {
      const token = await currentUser?.getIdToken();
      const response = await axios.post(`${API_BASE_URL}/ai/generate-post`, {
        prompt: aiPrompt,
        type: 'code'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.content) {
        setPostContent(response.data.content);
        setAiPrompt('');
      }
    } catch (error) {
      setError('Failed to generate AI content. Make sure Gemini API key is configured.');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      content: commentText,
      user: {
        displayName: userProfile?.displayName || 'You',
        username: userProfile?.username || 'you'
      },
      createdAt: new Date()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment],
          commentsCount: post.commentsCount + 1
        };
      }
      return post;
    }));

    setCommentText('');
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getLevelInfo = (level) => {
    const levels = {
      'Newcomer': { icon: '👤', color: '#9E9E9E' },
      'Beginner': { icon: '🌱', color: '#2196F3' },
      'Intermediate': { icon: '📈', color: '#4CAF50' },
      'Expert': { icon: '🥉', color: '#CD7F32' },
      'Veteran': { icon: '🏆', color: '#C0C0C0' },
      'Grandmaster': { icon: '👑', color: '#FFD700' },
    };
    return levels[level] || levels['Newcomer'];
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Top Navigation */}
      <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              <CameraAlt sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
              Pakistagram
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, mx: 4, maxWidth: 300 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  borderRadius: 3,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Box>

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: 'black' }}>
              <Home />
            </IconButton>
            <IconButton onClick={() => setCreatePostOpen(true)} sx={{ color: 'black' }}>
              <Add />
            </IconButton>
            <IconButton onClick={() => navigate('/profile')} sx={{ color: 'black' }}>
              <Person />
            </IconButton>
            <IconButton onClick={logout} sx={{ color: 'black' }}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Main Feed */}
          <Grid item xs={12} md={8}>
            {/* Stories Section */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Developer Stories
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                  {[1, 2, 3, 4, 5].map((story) => (
                    <Box key={story} sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          border: '3px solid',
                          borderColor: 'primary.main',
                          mb: 1,
                          cursor: 'pointer'
                        }}
                      >
                        {story}
                      </Avatar>
                      <Typography variant="caption">Dev {story}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {posts.map((post) => (
              <Card key={post.id} sx={{ mb: 3, borderRadius: 3 }}>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/profile/${post.user.username}`)}
                    >
                      {post.user.displayName?.[0]?.toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${post.user.username}`)}
                      >
                        {post.user.displayName}
                      </Typography>
                      <Chip
                        icon={<span>{getLevelInfo(post.user.level).icon}</span>}
                        label={post.user.level}
                        size="small"
                        sx={{
                          backgroundColor: `${getLevelInfo(post.user.level).color}20`,
                          color: getLevelInfo(post.user.level).color,
                          fontSize: '10px',
                          height: 20,
                        }}
                      />
                      {post.isAIGenerated && (
                        <Chip
                          icon={<AutoAwesome sx={{ fontSize: 12 }} />}
                          label="AI"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(156, 39, 176, 0.1)',
                            color: '#9C27B0',
                            fontSize: '10px',
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  }
                  subheader={`@${post.user.username} • ${formatTimeAgo(post.createdAt)}`}
                  action={
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  }
                />

                <CardContent sx={{ pt: 0 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {post.content}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    startIcon={post.isLiked ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
                    onClick={() => handleLike(post.id)}
                    sx={{ color: post.isLiked ? 'red' : 'text.secondary' }}
                  >
                    {post.likesCount}
                  </Button>
                  <Button
                    startIcon={<ChatBubbleOutline />}
                    onClick={() => toggleComments(post.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    {post.commentsCount}
                  </Button>
                  <Button
                    startIcon={<Share />}
                    sx={{ color: 'text.secondary' }}
                  >
                    Share
                  </Button>
                </CardActions>

                {/* Comments Section */}
                <Collapse in={expandedComments[post.id]}>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    {post.comments?.map((comment) => (
                      <Box key={comment.id} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {comment.user.displayName[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2">
                            <strong>{comment.user.displayName}</strong> {comment.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    
                    {/* Add Comment */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {userProfile?.displayName?.[0]}
                      </Avatar>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id);
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleComment(post.id)}
                                disabled={!commentText.trim()}
                              >
                                <Send />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </Collapse>
              </Card>
            ))}
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            {/* User Profile Card */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60 }}>
                    {userProfile?.displayName?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {userProfile?.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{userProfile?.username}
                    </Typography>
                    <Chip
                      icon={<span>{getLevelInfo(userProfile?.level || 'Newcomer').icon}</span>}
                      label={userProfile?.level || 'Newcomer'}
                      size="small"
                      sx={{
                        backgroundColor: `${getLevelInfo(userProfile?.level || 'Newcomer').color}20`,
                        color: getLevelInfo(userProfile?.level || 'Newcomer').color,
                        mt: 1,
                      }}
                    />
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Suggested Developers
                </Typography>
                <List sx={{ p: 0 }}>
                  {suggestedUsers.map((user, index) => (
                    <React.Fragment key={user.username}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar>{user.displayName[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.displayName}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                @{user.username}
                              </Typography>
                              <Chip
                                label={user.level}
                                size="small"
                                sx={{
                                  fontSize: '10px',
                                  height: 16,
                                  backgroundColor: `${getLevelInfo(user.level).color}20`,
                                  color: getLevelInfo(user.level).color,
                                }}
                              />
                            </Box>
                          }
                        />
                        <Button size="small" variant="contained">
                          Follow
                        </Button>
                      </ListItem>
                      {index < suggestedUsers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Create Post Dialog */}
      <Dialog open={createPostOpen} onClose={() => setCreatePostOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <FormControlLabel
            control={
              <Switch
                checked={aiMode}
                onChange={(e) => setAiMode(e.target.checked)}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome sx={{ color: 'purple' }} />
                AI-Powered Post Generation
              </Box>
            }
            sx={{ mb: 2 }}
          />

          {aiMode && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="AI Prompt"
                placeholder="Describe what you want to post about..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 1 }}
              />
              <Button
                startIcon={<AutoAwesome />}
                onClick={generateAIContent}
                disabled={!aiPrompt.trim()}
                sx={{ color: 'purple' }}
              >
                Generate Content
              </Button>
            </Box>
          )}

          <TextField
            fullWidth
            label="What's on your mind?"
            placeholder={aiMode ? "AI-generated content will appear here..." : "Share your thoughts, code snippets, or tech insights..."}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            {postContent.length}/500 characters
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatePostOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!postContent.trim()}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;