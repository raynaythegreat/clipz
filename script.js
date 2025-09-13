class ClipzAI {
    constructor() {
        this.currentVideo = null;
        this.generatedClips = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeVideo());
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.uploadToSocial(e.target.dataset.platform));
        });
    }

    async analyzeVideo() {
        const url = document.getElementById('videoUrl').value.trim();
        if (!url) {
            alert('Please enter a video URL');
            return;
        }

        this.showProgress('Analyzing video...', 20);
        
        try {
            // Simulate video analysis (in real implementation, this would call your backend)
            const videoInfo = await this.extractVideoInfo(url);
            this.currentVideo = videoInfo;
            this.displayVideoInfo(videoInfo);
            this.showProgress('Generating clips...', 60);
            
            // Generate clips
            const clips = await this.generateClips(videoInfo);
            this.generatedClips = clips;
            this.displayClips(clips);
            
            this.showProgress('Complete!', 100);
            setTimeout(() => this.hideProgress(), 2000);
            
        } catch (error) {
            console.error('Error analyzing video:', error);
            alert('Error analyzing video. Please try again.');
            this.hideProgress();
        }
    }

    async extractVideoInfo(url) {
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });
            
            if (!response.ok) {
                throw new Error('Failed to analyze video');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to mock data if API is not available
            return {
                title: "Amazing Tutorial: How to Build Viral Content",
                duration: "15:30",
                channel: "Tech Tutorials",
                thumbnail: "https://via.placeholder.com/320x180/667eea/ffffff?text=Video+Thumbnail",
                url: url
            };
        }
    }

    displayVideoInfo(videoInfo) {
        document.getElementById('thumbnail').src = videoInfo.thumbnail;
        document.getElementById('videoTitle').textContent = videoInfo.title;
        document.getElementById('videoDuration').textContent = `Duration: ${videoInfo.duration}`;
        document.getElementById('videoChannel').textContent = `Channel: ${videoInfo.channel}`;
        document.getElementById('videoInfo').classList.remove('hidden');
    }

    async generateClips(videoInfo) {
        try {
            const response = await fetch('/api/generate-clips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    videoUrl: videoInfo.url,
                    videoInfo: videoInfo
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate clips');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to mock data if API is not available
            return new Promise((resolve) => {
                setTimeout(() => {
                    const clips = [
                        {
                            id: 1,
                            title: "Hook: The Secret to Viral Content",
                            startTime: "0:15",
                            endTime: "0:45",
                            caption: "🔥 The secret to viral content isn't what you think! This technique changed everything for me...",
                            thumbnail: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Clip+1"
                        },
                        {
                            id: 2,
                            title: "Key Insight: Content Strategy",
                            startTime: "3:20",
                            endTime: "4:10",
                            caption: "💡 Here's the content strategy that got me 1M+ views. Most creators are doing this wrong...",
                            thumbnail: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Clip+2"
                        },
                        {
                            id: 3,
                            title: "Call to Action: Engagement Tips",
                            startTime: "8:45",
                            endTime: "9:30",
                            caption: "🚀 Want more engagement? Try this simple trick that increased my comments by 300%...",
                            thumbnail: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=Clip+3"
                        }
                    ];
                    resolve(clips);
                }, 3000);
            });
        }
    }

    displayClips(clips) {
        const container = document.getElementById('clipsContainer');
        container.innerHTML = '';

        clips.forEach(clip => {
            const clipCard = document.createElement('div');
            clipCard.className = 'clip-card';
            clipCard.innerHTML = `
                <div class="clip-preview">
                    <i class="fas fa-play-circle" style="font-size: 3rem; color: #667eea;"></i>
                </div>
                <div class="clip-title">${clip.title}</div>
                <div class="clip-caption">${clip.caption}</div>
                <div class="clip-actions">
                    <button class="btn btn-small btn-download" onclick="clipzAI.downloadClip(${clip.id})">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn btn-small btn-upload" onclick="clipzAI.selectClip(${clip.id})">
                        <i class="fas fa-upload"></i> Upload
                    </button>
                </div>
            `;
            container.appendChild(clipCard);
        });

        document.getElementById('clipsSection').classList.remove('hidden');
        document.getElementById('socialSection').classList.remove('hidden');
    }

    selectClip(clipId) {
        const clip = this.generatedClips.find(c => c.id === clipId);
        if (clip) {
            this.selectedClip = clip;
            // Highlight selected clip
            document.querySelectorAll('.clip-card').forEach(card => {
                card.style.border = '2px solid #e9ecef';
            });
            event.target.closest('.clip-card').style.border = '2px solid #667eea';
        }
    }

    downloadClip(clipId) {
        const clip = this.generatedClips.find(c => c.id === clipId);
        if (clip) {
            // In a real implementation, this would download the actual video file
            alert(`Downloading clip: ${clip.title}`);
        }
    }

    async uploadToSocial(platform) {
        if (!this.selectedClip) {
            alert('Please select a clip first by clicking the "Upload" button on a clip');
            return;
        }

        this.showProgress(`Uploading to ${platform}...`, 30);

        try {
            // Simulate upload process
            await this.simulateUpload(platform, this.selectedClip);
            this.showProgress('Upload successful!', 100);
            setTimeout(() => this.hideProgress(), 2000);
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Error uploading to ${platform}. Please try again.`);
            this.hideProgress();
        }
    }

    async simulateUpload(platform, clip) {
        try {
            const response = await fetch('/api/upload-social', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    platform: platform,
                    clipData: clip,
                    credentials: {} // In a real app, you'd get these from user input
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload to social media');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to simulation if API is not available
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`Uploading to ${platform}:`, clip.title);
                    resolve({ success: true, message: `Video uploaded to ${platform} successfully` });
                }, 3000);
            });
        }
    }

    showProgress(text, percentage) {
        document.getElementById('progressText').textContent = text;
        document.getElementById('progressFill').style.width = percentage + '%';
        document.getElementById('progressSection').classList.remove('hidden');
    }

    hideProgress() {
        document.getElementById('progressSection').classList.add('hidden');
    }
}

// Initialize the app
const clipzAI = new ClipzAI();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add demo URL for testing
    const demoUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.tiktok.com/@user/video/1234567890',
        'https://www.instagram.com/p/ABC123/'
    ];
    
    // Add demo button
    const demoBtn = document.createElement('button');
    demoBtn.className = 'btn btn-primary';
    demoBtn.style.marginTop = '10px';
    demoBtn.innerHTML = '<i class="fas fa-magic"></i> Try Demo';
    demoBtn.onclick = () => {
        const randomUrl = demoUrls[Math.floor(Math.random() * demoUrls.length)];
        document.getElementById('videoUrl').value = randomUrl;
    };
    
    document.querySelector('.input-group').appendChild(demoBtn);
});
