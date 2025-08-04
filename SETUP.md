# Pakistagram Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- Flutter SDK (v3.0 or higher)
- Firebase CLI
- Git

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key for AI features
   - Add your Firebase service account key path

4. **Firebase Service Account:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Save the JSON file in the backend directory
   - Update the path in your `.env` file

5. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3000`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Firebase Configuration:**
   - The Firebase configuration is already set up in `lib/firebase_options.dart`
   - Make sure your Firebase project has the following enabled:
     - Authentication (Email/Password)
     - Firestore Database
     - Storage

4. **Run the app:**
   ```bash
   flutter run
   ```

## Firebase Setup

### 1. Authentication
- Enable Email/Password authentication in Firebase Console
- Go to Authentication → Sign-in method → Email/Password → Enable

### 2. Firestore Database
- Create a Firestore database in production mode
- Set up the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Others can read profiles
    }
    
    // Posts are readable by authenticated users
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Comments are readable by authenticated users
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Likes and follows
    match /likes/{likeId} {
      allow read, write: if request.auth != null;
    }
    
    match /follows/{followId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Storage
- Enable Firebase Storage for image uploads
- Set up storage rules for authenticated users

## API Endpoints

### Authentication
- `POST /api/auth/create-profile` - Create user profile
- `GET /api/auth/profile` - Get current user profile

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/feed` - Get posts feed
- `POST /api/posts/:postId/like` - Like/unlike a post
- `POST /api/posts/:postId/comments` - Add comment
- `GET /api/posts/:postId/comments` - Get comments

### Users
- `GET /api/users/:username` - Get user by username
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/:username/follow` - Follow/unfollow user

### AI Features
- `POST /api/ai/generate-post` - Generate AI post content
- `POST /api/ai/generate-hashtags` - Generate hashtags
- `POST /api/ai/suggest-image-prompts` - Get image prompt suggestions

## Features

### ✅ Implemented
- User authentication (Firebase Auth)
- User profiles with levels
- Post creation and viewing
- Like and comment system
- Follow system
- AI-powered post generation
- Clean, minimal UI
- Pakistan-themed design

### 🚧 Coming Soon
- Image upload and display
- Real-time notifications
- Advanced search
- Direct messaging
- Push notifications
- Mobile app optimization

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
flutter run  # For development
flutter build apk  # For Android build
flutter build ios  # For iOS build
```

## Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or Vercel
- Set environment variables in your deployment platform
- Update the API base URL in the Flutter app

### Frontend Deployment
- Build the Flutter app for your target platform
- For web: `flutter build web`
- For mobile: Build APK/IPA files

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues:**
   - Verify your Firebase configuration
   - Check if all required services are enabled
   - Ensure API keys are correct

2. **Backend API Issues:**
   - Check if the server is running on port 3000
   - Verify environment variables are set
   - Check Firebase service account permissions

3. **Flutter Build Issues:**
   - Run `flutter clean` and `flutter pub get`
   - Check Flutter SDK version compatibility
   - Verify all dependencies are properly installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the setup guide

---

**Happy coding! 🇵🇰**