# Pakistagram 🇵🇰

A social media platform for the Pakistani developer community, combining the best of Instagram and Discord with AI-powered features.

## Features

- 📱 Instagram-like clean interface (React Web + Flutter Mobile)
- 🔐 Firebase Authentication
- 📝 Post creation with AI generation (Gemini AI)
- ❤️ Like, comment, and follow system
- 👤 Individual user profiles with levels
- 🏆 Developer levels (Newcomer → Beginner → Intermediate → Expert → Veteran → Grandmaster)
- 🎨 Pakistan-themed sleek design
- 💬 Real-time comments and interactions
- 🔍 User search and discovery
- 📊 User stats and activity tracking

## Tech Stack

### Frontend (Web)
- React 18
- Material-UI (MUI)
- Firebase SDK
- Axios for API calls
- React Router for navigation

### Frontend (Mobile)
- Flutter
- Firebase SDK

### Backend
- Node.js with Express
- Firebase Admin SDK
- Google Gemini AI
- RESTful API architecture

## Project Structure

```
pakistagram/
├── frontend-web/      # React web app
├── frontend/          # Flutter mobile app
├── backend/           # Node.js API server
├── SETUP.md          # Detailed setup guide
└── README.md         # This file
```

## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd pakistagram
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm start
```

### 3. Frontend Web Setup
```bash
cd frontend-web
npm install
npm start
```

### 4. Frontend Mobile Setup (Optional)
```bash
cd frontend
flutter pub get
flutter run
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_SERVICE_ACCOUNT_KEY=path_to_service_account_key.json
```

## Firebase Configuration

Project ID: deft-legacy-458411-u4

The app works in demo mode without Firebase Admin SDK, but for full functionality:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Save the JSON file and update the path in `.env`

## Features Overview

### User Levels System
- **Newcomer** (0-9 pts) - New users 👤
- **Beginner** (10-49 pts) - Getting started 🌱
- **Intermediate** (50-99 pts) - Regular contributors 📈
- **Expert** (100-499 pts) - Active community members 🥉
- **Veteran** (500-999 pts) - Experienced developers 🏆
- **Grandmaster** (1000+ pts) - Top contributors 👑

### AI Features
- Post generation using Google Gemini
- Hashtag suggestions
- Content optimization
- Multiple AI prompt types (code, motivational, tech-news)

### Social Features
- Follow/unfollow users
- Like and comment on posts
- User profiles with stats
- Real-time feed updates
- Search functionality

## API Endpoints

- `POST /api/auth/create-profile` - Create user profile
- `GET /api/auth/profile` - Get current user profile
- `POST /api/posts` - Create a new post
- `GET /api/posts/feed` - Get posts feed
- `POST /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/comments` - Add comment
- `POST /api/ai/generate-post` - Generate AI content
- `POST /api/ai/generate-hashtags` - Generate hashtags

## Development

### Running in Development Mode
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend Web (Terminal 2)
cd frontend-web && npm start
```

### Building for Production
```bash
# Backend
cd backend && npm run build

# Frontend Web
cd frontend-web && npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [SETUP.md](SETUP.md) for detailed setup instructions

---

**Made with ❤️ for the Pakistani Developer Community 🇵🇰**