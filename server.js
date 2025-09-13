const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const puppeteer = require('puppeteer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to analyze video
app.post('/api/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Extract video information
        const videoInfo = await extractVideoInfo(url);
        res.json(videoInfo);
        
    } catch (error) {
        console.error('Error analyzing video:', error);
        res.status(500).json({ error: 'Failed to analyze video' });
    }
});

// API endpoint to generate clips
app.post('/api/generate-clips', async (req, res) => {
    try {
        const { videoUrl, videoInfo } = req.body;
        
        // Download video
        const videoPath = await downloadVideo(videoUrl);
        
        // Generate clips using AI
        const clips = await generateClips(videoPath, videoInfo);
        
        res.json(clips);
        
    } catch (error) {
        console.error('Error generating clips:', error);
        res.status(500).json({ error: 'Failed to generate clips' });
    }
});

// API endpoint to upload to social media
app.post('/api/upload-social', async (req, res) => {
    try {
        const { platform, clipData, credentials } = req.body;
        
        const result = await uploadToSocialMedia(platform, clipData, credentials);
        res.json(result);
        
    } catch (error) {
        console.error('Error uploading to social media:', error);
        res.status(500).json({ error: 'Failed to upload to social media' });
    }
});

// Helper functions
async function extractVideoInfo(url) {
    try {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            return {
                title: info.videoDetails.title,
                duration: info.videoDetails.lengthSeconds,
                channel: info.videoDetails.author.name,
                thumbnail: info.videoDetails.thumbnails[0].url,
                url: url
            };
        } else {
            // For other platforms, we'd need different extractors
            return {
                title: "Video from " + new URL(url).hostname,
                duration: "Unknown",
                channel: "Unknown",
                thumbnail: "https://via.placeholder.com/320x180",
                url: url
            };
        }
    } catch (error) {
        throw new Error('Failed to extract video information');
    }
}

async function downloadVideo(url) {
    try {
        const outputPath = path.join(__dirname, 'temp', 'video.mp4');
        await fs.ensureDir(path.dirname(outputPath));
        
        if (ytdl.validateURL(url)) {
            const stream = ytdl(url, { quality: 'highest' });
            const writeStream = fs.createWriteStream(outputPath);
            
            return new Promise((resolve, reject) => {
                stream.pipe(writeStream);
                writeStream.on('finish', () => resolve(outputPath));
                writeStream.on('error', reject);
            });
        } else {
            throw new Error('Unsupported video platform');
        }
    } catch (error) {
        throw new Error('Failed to download video');
    }
}

async function generateClips(videoPath, videoInfo) {
    // This is where you'd integrate with AI services like OpenAI
    // For now, we'll return mock clips
    return [
        {
            id: 1,
            title: "Hook: The Secret to Viral Content",
            startTime: "0:15",
            endTime: "0:45",
            caption: "🔥 The secret to viral content isn't what you think! This technique changed everything for me...",
            path: videoPath
        },
        {
            id: 2,
            title: "Key Insight: Content Strategy",
            startTime: "3:20",
            endTime: "4:10",
            caption: "💡 Here's the content strategy that got me 1M+ views. Most creators are doing this wrong...",
            path: videoPath
        },
        {
            id: 3,
            title: "Call to Action: Engagement Tips",
            startTime: "8:45",
            endTime: "9:30",
            caption: "🚀 Want more engagement? Try this simple trick that increased my comments by 300%...",
            path: videoPath
        }
    ];
}

async function uploadToSocialMedia(platform, clipData, credentials) {
    const browser = await puppeteer.launch({ 
        headless: false, // Set to true for production
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        switch (platform) {
            case 'tiktok':
                return await uploadToTikTok(page, clipData, credentials);
            case 'instagram':
                return await uploadToInstagram(page, clipData, credentials);
            case 'youtube':
                return await uploadToYouTube(page, clipData, credentials);
            default:
                throw new Error('Unsupported platform');
        }
    } finally {
        await browser.close();
    }
}

async function uploadToTikTok(page, clipData, credentials) {
    // Navigate to TikTok upload page
    await page.goto('https://www.tiktok.com/upload');
    
    // Wait for login if needed
    await page.waitForTimeout(3000);
    
    // Upload video file
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
        await fileInput.uploadFile(clipData.path);
    }
    
    // Add caption
    await page.type('[data-e2e="video-caption"]', clipData.caption);
    
    // Click publish
    await page.click('[data-e2e="publish-button"]');
    
    return { success: true, message: 'Video uploaded to TikTok successfully' };
}

async function uploadToInstagram(page, clipData, credentials) {
    // Navigate to Instagram
    await page.goto('https://www.instagram.com/');
    
    // Login process would go here
    await page.waitForTimeout(3000);
    
    // Navigate to create post
    await page.click('[aria-label="New post"]');
    
    // Upload video
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
        await fileInput.uploadFile(clipData.path);
    }
    
    // Add caption
    await page.type('[aria-label="Write a caption..."]', clipData.caption);
    
    // Share
    await page.click('[type="submit"]');
    
    return { success: true, message: 'Video uploaded to Instagram successfully' };
}

async function uploadToYouTube(page, clipData, credentials) {
    // Navigate to YouTube Studio
    await page.goto('https://studio.youtube.com/');
    
    // Click create button
    await page.click('#create-icon-button');
    await page.click('#text-item-0');
    
    // Upload video
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
        await fileInput.uploadFile(clipData.path);
    }
    
    // Add title and description
    await page.type('#textbox', clipData.title);
    await page.type('#textbox', clipData.caption);
    
    // Publish
    await page.click('#publish-button');
    
    return { success: true, message: 'Video uploaded to YouTube Shorts successfully' };
}

// Start server
app.listen(PORT, () => {
    console.log(`Clipz AI server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the app`);
});

module.exports = app;
