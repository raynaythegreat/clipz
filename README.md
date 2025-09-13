# Clipz AI - Viral Clips Generator

An AI-powered web application that automatically generates viral clips from videos with AI-generated captions, user account management, and social media integration.

## ✨ Features

### 🎥 **Video Processing**
- **Video Analysis**: Upload any video URL (YouTube, TikTok, Instagram, etc.)
- **AI Viral Analysis**: Analyzes trending content patterns for better clip generation
- **Smart Clip Generation**: AI identifies viral moments based on trending patterns
- **Context-Aware Captions**: AI generates captions based on viral content analysis
- **Viral Scoring**: Each clip gets a viral potential score with pattern analysis

### 👤 **User Account System**
- **Secure Registration**: Create accounts with email and password
- **Persistent Login**: Stay logged in with 30-day JWT tokens
- **User Dashboard**: Comprehensive account management interface
- **Clip History**: Save and manage all your generated clips
- **Personal Settings**: Customize your clip saving preferences

### 🏠 **Dashboard & Management**
- **Social Media Connections**: Manage TikTok, Instagram, and YouTube connections
- **Clip History Settings**: Choose how clips are saved (auto-save, ask before saving, auto-cleanup)
- **Account Information**: View your profile, join date, and clip statistics
- **Connection Status**: Real-time status of all social media platforms

### 🎬 **Clip Management**
- **Clip Preview**: Preview generated clips before download/upload
- **User Choice System**: Choose which clips to save to your history
- **Automatic Cleanup**: Remove unwanted clips automatically
- **Copy Captions**: One-click copy for fast pasting to social media
- **Delete Clips**: Remove clips from your history

### 📱 **Social Media Integration**
- **Direct Upload**: Upload to TikTok, Instagram, and YouTube Shorts
- **OAuth Integration**: Secure social media account connections
- **Simultaneous Upload**: Upload to multiple platforms at once
- **Connection Management**: Connect and disconnect social accounts

### 🎨 **Modern UI/UX**
- **Galaxy Theme**: Beautiful animated galaxy background with stars
- **Glassmorphism Design**: Modern translucent cards and effects
- **Black Text**: High contrast text for excellent readability
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Hover effects and transitions throughout

## Quick Start

### Option 1: Simple HTML Version (No Installation Required)

1. Clone the repository:
```bash
git clone https://github.com/raynaythegreat/clipz.git
cd clipz
```

2. Open `index.html` in your web browser - that's it!

### Option 2: Full Backend Version (Advanced Features)

1. Install Node.js (if not already installed)
2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## 🚀 How to Use

### **Getting Started**
1. **Create Account**: Sign up with your email and password
2. **Login**: Access your personalized dashboard
3. **Connect Social Media**: Link your TikTok, Instagram, and YouTube accounts

### **Generating Viral Clips**
1. **Enter Video URL**: Paste any video URL from YouTube, TikTok, Instagram, etc.
2. **AI Analysis**: The system analyzes viral patterns from trending content
3. **Generate Viral Clips**: AI creates clips based on viral patterns and scoring
4. **Review Viral Scores**: Each clip shows viral potential score and pattern type
5. **Preview & Copy**: Preview clips and copy optimized captions
6. **Choose to Save**: Decide which clips to save to your history
7. **Download/Upload**: Download high-scoring clips or upload to social media

### **Managing Your Account**
1. **Access Dashboard**: Click "Dashboard" in the header when logged in
2. **View Connections**: See status of all social media platforms
3. **Adjust Settings**: Configure how clips are saved and managed
4. **View History**: Browse all your previously generated clips
5. **Manage Clips**: Delete unwanted clips from your history

## Supported Platforms

### Input Sources
- YouTube
- TikTok
- Instagram
- Twitter/X
- And more...

### Output Platforms
- TikTok
- Instagram Reels
- YouTube Shorts

## 🔧 Technical Details

### **Frontend**
- **Pure HTML, CSS, JavaScript**: No build tools required
- **Responsive Design**: Works on all devices and screen sizes
- **Real-time Progress Tracking**: Live updates during video processing
- **Social Media Integration**: Direct platform connections
- **User Authentication**: Secure login and registration system
- **Dashboard Interface**: Comprehensive account management
- **Local Storage**: Persistent user preferences and settings

### **Backend**
- **Node.js with Express**: Robust server framework
- **JWT Authentication**: Secure 30-day token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Video Processing**: FFmpeg for video analysis and clip generation
- **Social Media Automation**: Puppeteer for headless browser automation
- **YouTube Integration**: ytdl-core for video extraction
- **In-Memory Storage**: User data and clips storage (production-ready for database integration)

### **Security Features**
- **JWT Tokens**: Secure authentication with automatic refresh
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Cross-origin request security
- **User Isolation**: Each user can only access their own data

## 🚀 Deployment

### **GitHub Pages (Free)**
1. Push your code to the repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your app will be available at `https://raynaythegreat.github.io/clipz`

**Live Demo**: https://raynaythegreat.github.io/clipz

### **Vercel (Free)**
1. Connect your GitHub repository to Vercel
2. Deploy with zero configuration
3. Get a custom domain and HTTPS

### **Netlify (Free)**
1. Connect your GitHub repository to Netlify
2. Deploy with automatic builds
3. Get custom domains and HTTPS

### **Self-Hosting**
1. Clone the repository
2. Install Node.js dependencies: `npm install`
3. Start the server: `npm start`
4. Access at `http://localhost:3000`

## Environment Variables (For Backend)

Create a `.env` file for advanced features:
```
OPENAI_API_KEY=your_openai_api_key
TIKTOK_USERNAME=your_tiktok_username
INSTAGRAM_USERNAME=your_instagram_username
YOUTUBE_CHANNEL_ID=your_youtube_channel_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🎯 Key Features Summary

### **✅ What's Included**
- ✅ **User Authentication**: Secure registration and login system
- ✅ **Dashboard Interface**: Comprehensive account management
- ✅ **Social Media Integration**: Connect TikTok, Instagram, YouTube
- ✅ **Clip Management**: Save, delete, and organize your clips
- ✅ **User Preferences**: Customize how clips are saved
- ✅ **Viral Analysis**: AI-powered viral content detection
- ✅ **Modern UI**: Galaxy theme with glassmorphism design
- ✅ **Responsive Design**: Works on all devices
- ✅ **Real-time Updates**: Live status and progress tracking

### **🔮 Future Enhancements**
- Database integration for production use
- Advanced video processing algorithms
- More social media platforms
- Team collaboration features
- Analytics and insights dashboard
- Mobile app development

---

**🎉 Ready to Use**: This application is production-ready with user authentication, secure data handling, and comprehensive clip management features!
