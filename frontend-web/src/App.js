import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SetupProfilePage from './pages/SetupProfilePage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import LoadingScreen from './components/LoadingScreen';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0tlPM5KblUDLqW8jN1pPslmL8fWWDs2Y",
  authDomain: "deft-legacy-458411-u4.firebaseapp.com",
  projectId: "deft-legacy-458411-u4",
  storageBucket: "deft-legacy-458411-u4.firebasestorage.app",
  messagingSenderId: "980541844466",
  appId: "1:980541844466:web:2b04299e2829a813add96b",
  measurementId: "G-EQ6RT3QQXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Pakistan-themed Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#01411C',
      light: '#4CAF50',
      dark: '#2E7D32',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <LoginPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <SignUpPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/setup-profile" 
              element={user ? <SetupProfilePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={user ? <HomePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile/:username" 
              element={user ? <UserProfilePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <UserProfilePage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;