# Clipz AI - Viral Clips Generator

An AI-powered web application that automatically generates viral clips from videos with AI-generated captions and uploads them to social media platforms.

## Features

- 🎥 **Video Analysis**: Upload any video URL (YouTube, TikTok, Instagram, etc.)
- 🤖 **AI Clip Generation**: Automatically identify the most engaging moments
- 📝 **Smart AI Captions**: Context-aware captions based on video content and platform
- 📋 **Copy Captions**: One-click copy for fast pasting to social media
- 🎬 **Clip Preview**: Preview generated clips before download/upload
- 📱 **Social Media Upload**: Direct upload to TikTok, Instagram, and YouTube Shorts
- 🎨 **Modern UI**: Clean, responsive design optimized for all devices

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

## How to Use

1. **Enter Video URL**: Paste any video URL from YouTube, TikTok, Instagram, etc.
2. **Analyze**: Click "Analyze Video" to extract video information
3. **Generate Clips**: The AI will automatically identify viral moments with smart captions
4. **Preview Clips**: Click the play button to preview each clip
5. **Copy Captions**: Click the copy button to copy captions for easy pasting
6. **Download/Upload**: Download clips (caption auto-copied) or upload to social media

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

## Technical Details

### Frontend
- Pure HTML, CSS, and JavaScript (no build tools required)
- Responsive design with modern UI
- Real-time progress tracking
- Social media integration

### Backend (Optional)
- Node.js with Express
- Video processing with FFmpeg
- Social media automation with Puppeteer
- YouTube video extraction with ytdl-core

## Deployment

### GitHub Pages (Free)
1. Push your code to the repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your app will be available at `https://raynaythegreat.github.io/clipz`

### Vercel (Free)
1. Connect your GitHub repository to Vercel
2. Deploy with zero configuration
3. Get a custom domain and HTTPS

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

---

**Note**: This is a demo application. For production use, you'll need to:
- Add proper error handling
- Implement user authentication
- Add rate limiting
- Set up proper video storage
- Configure social media API credentials
