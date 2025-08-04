const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
let firebaseInitialized = false;
try {
  // Try to initialize with service account if available
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && 
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== 'path_to_service_account_key.json' &&
      require('fs').existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)) {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "deft-legacy-458411-u4.firebasestorage.app"
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized with service account');
  } else {
    console.log('⚠️  Firebase Admin not initialized - service account not found');
    console.log('📝 To enable full functionality:');
    console.log('   1. Go to Firebase Console → Project Settings → Service Accounts');
    console.log('   2. Generate a new private key');
    console.log('   3. Save the JSON file and update FIREBASE_SERVICE_ACCOUNT_KEY in .env');
    console.log('   4. The app will work in demo mode for now');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.log('📝 Running in demo mode - some features may be limited');
}

// Initialize Firestore only if Firebase is properly initialized
let db = null;
if (firebaseInitialized) {
  db = admin.firestore();
}

// Demo mode middleware
app.use((req, res, next) => {
  req.firebaseInitialized = firebaseInitialized;
  req.db = db;
  next();
});

// Routes
app.use('/api/demo', require('./routes/demo'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/ai', require('./routes/ai'));

app.get('/', (req, res) => {
  res.json({ message: 'Pakistagram API is running! 🇵🇰' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;