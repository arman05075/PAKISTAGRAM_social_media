import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #01411C 0%, #4CAF50 100%)',
        color: 'white',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          backgroundColor: 'white',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <CameraAltIcon sx={{ fontSize: 60, color: '#01411C' }} />
      </Box>
      
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, letterSpacing: 1.2 }}>
        Pakistagram
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 500 }}>
        For Pakistani Developers 🇵🇰
      </Typography>
      
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  );
};

export default LoadingScreen;