# Clipz AI v2.0 - Setup Guide for Real Social Media Connections

## 🚀 Quick Start

### 1. Install Node.js
Download and install Node.js from: https://nodejs.org/
- Choose the LTS version (recommended)
- Follow the installation wizard
- Restart your terminal after installation

### 2. Install Dependencies
```bash
cd /Users/ray/clipz
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root:
```bash
# JWT Secret Key (change this in production)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for email verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Base URL for email verification links
BASE_URL=http://localhost:3000

# Social Media API Credentials
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret

YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret

# Server Configuration
PORT=3000
```

### 4. Start the Server
```bash
node server.js
```

## 🔑 Social Media API Setup

### TikTok API Setup
1. Go to https://developers.tiktok.com/
2. Create a developer account
3. Create a new app
4. Get your Client Key and Client Secret
5. Add them to your `.env` file

### Instagram API Setup
1. Go to https://developers.facebook.com/
2. Create a Facebook Developer account
3. Create a new app
4. Add Instagram Basic Display product
5. Get your App ID and App Secret
6. Add them to your `.env` file

### YouTube API Setup
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Get your Client ID and Client Secret
6. Add them to your `.env` file

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the setup prompts
4. Add environment variables in Vercel dashboard

### Option 2: Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Add environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

### Option 3: Railway
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

## 🔧 Troubleshooting

### Node.js Not Found
- Make sure Node.js is installed: `node --version`
- Restart your terminal after installation
- Check your PATH environment variable

### Server Won't Start
- Check if port 3000 is available
- Make sure all dependencies are installed: `npm install`
- Check your `.env` file for missing variables

### Social Media Connection Fails
- Verify your API credentials in `.env`
- Check if your app is approved by the platform
- Ensure your redirect URLs are configured correctly

## 📱 Features

### ✅ Working Features
- User registration and login
- Email verification
- Video analysis and clip generation
- Real social media connections
- Automatic uploads to connected platforms
- User dashboard and clip history
- Persistent sessions

### 🔄 Real Social Media Integration
- TikTok: Connect account and upload clips
- Instagram: Connect account and upload reels
- YouTube: Connect channel and upload shorts
- OAuth 2.0 authentication flows
- Secure token storage and management

## 🎯 Next Steps

1. **Install Node.js** from the official website
2. **Set up API credentials** for your preferred platforms
3. **Configure environment variables** in `.env` file
4. **Start the server** with `node server.js`
5. **Test the application** at http://localhost:3000

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your API credentials
3. Ensure all dependencies are installed
4. Check the server logs for detailed error information

---

**Note**: This application now requires a running server for full functionality. The offline mode has been removed to implement real social media connections.
