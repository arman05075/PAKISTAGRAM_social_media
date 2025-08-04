import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Link as LinkIcon,
  CalendarToday,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UserProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { userProfile: currentUserProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadUserPosts();
  }, [username]);

  const loadUserProfile = async () => {
    try {
      // Simulate loading user profile
      const mockProfile = {
        uid: 'user123',
        username: username,
        displayName: username === 'ahmed_dev' ? 'Ahmed Khan' : 'Developer User',
        bio: 'Full-stack developer from Karachi 🇵🇰 | React, Node.js, Python | Building the future one line of code at a time',
        avatar: '',
        level: 'Expert',
        levelPoints: 450,
        postsCount: 24,
        followersCount: 156,
        followingCount: 89,
        location: 'Karachi, Pakistan',
        website: 'https://github.com/' + username,
        joinedDate: new Date('2023-01-15'),
      };
      
      setUserProfile(mockProfile);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      // Simulate loading user posts
      const mockPosts = [
        {
          id: '1',
          content: 'Just deployed my first React app with Firebase! 🚀 The feeling is incredible.',
          likesCount: 24,
          commentsCount: 8,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          content: 'Working on a new e-commerce platform using MERN stack. Excited to share the progress!',
          likesCount: 18,
          commentsCount: 5,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          content: 'Learning Docker and Kubernetes. The DevOps journey continues! 🐳',
          likesCount: 32,
          commentsCount: 12,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ];
      
      setUserPosts(mockPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Update follower count
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        followersCount: isFollowing 
          ? userProfile.followersCount - 1 
          : userProfile.followersCount + 1
      });
    }
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
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  const isOwnProfile = currentUserProfile?.username === username;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/')} sx={{ color: 'black', mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
              {userProfile.displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {userProfile.postsCount} posts
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '48px',
                  fontWeight: 'bold',
                }}
              >
                {userProfile.displayName[0]?.toUpperCase()}
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {userProfile.displayName}
                  </Typography>
                  {isOwnProfile ? (
                    <Button
                      variant="outlined"
                      startIcon={<Settings />}
                      onClick={() => navigate('/settings')}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant={isFollowing ? "outlined" : "contained"}
                      onClick={handleFollow}
                      sx={{ minWidth: 100 }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </Box>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  @{userProfile.username}
                </Typography>

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {userProfile.postsCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posts
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {userProfile.followersCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {userProfile.followingCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Following
                    </Typography>
                  </Box>
                </Box>

                {/* Level Badge */}
                <Chip
                  icon={<span>{getLevelInfo(userProfile.level).icon}</span>}
                  label={`${userProfile.level} (${userProfile.levelPoints} pts)`}
                  sx={{
                    backgroundColor: `${getLevelInfo(userProfile.level).color}20`,
                    color: getLevelInfo(userProfile.level).color,
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                />
              </Box>
            </Box>

            {/* Bio */}
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {userProfile.bio}
            </Typography>

            {/* Additional Info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'text.secondary' }}>
              {userProfile.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{userProfile.location}</Typography>
                </Box>
              )}
              {userProfile.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LinkIcon sx={{ fontSize: 16 }} />
                  <Typography
                    variant="body2"
                    component="a"
                    href={userProfile.website}
                    target="_blank"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    {userProfile.website.replace('https://', '')}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 16 }} />
                <Typography variant="body2">
                  Joined {userProfile.joinedDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card sx={{ borderRadius: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Posts" />
            <Tab label="Replies" />
            <Tab label="Media" />
            <Tab label="Likes" />
          </Tabs>

          {/* Posts Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 2 }}>
              {userPosts.map((post) => (
                <Card key={post.id} sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ width: 40, height: 40 }}>
                        {userProfile.displayName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {userProfile.displayName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{userProfile.username} • {formatTimeAgo(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {post.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                      <Typography variant="body2">
                        {post.likesCount} likes
                      </Typography>
                      <Typography variant="body2">
                        {post.commentsCount} comments
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Other tabs content */}
          {tabValue !== 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {tabValue === 1 && "No replies yet"}
                {tabValue === 2 && "No media posts yet"}
                {tabValue === 3 && "No liked posts yet"}
              </Typography>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default UserProfilePage;