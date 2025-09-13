class ClipzAI {
    constructor() {
        this.currentVideo = null;
        this.generatedClips = [];
        this.selectedClip = null;
        this.previewClip = null;
        this.connectedPlatforms = {
            tiktok: false,
            instagram: false,
            youtube: false
        };
        this.initializeEventListeners();
        this.loadConnectionStatus();
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeVideo());
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.uploadToSocial(e.target.dataset.platform));
        });
        
        // Add click listeners to header status indicators
        document.querySelectorAll('.platform-status').forEach(status => {
            status.addEventListener('click', () => {
                document.querySelector('.social-connection-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
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
            
            // Apply viral score styling
            let viralClass = '';
            if (clip.viralScore) {
                if (clip.viralScore >= 0.8) {
                    viralClass = 'high-viral';
                } else if (clip.viralScore >= 0.6) {
                    viralClass = 'medium-viral';
                } else {
                    viralClass = 'low-viral';
                }
            }
            
            clipCard.className = `clip-card ${viralClass}`;
            clipCard.innerHTML = `
                <button class="preview-btn" onclick="clipzAI.previewClip(${clip.id})" title="Preview Clip">
                    <i class="fas fa-play"></i>
                </button>
                <div class="clip-preview">
                    <i class="fas fa-video" style="font-size: 3rem; color: #667eea;"></i>
                </div>
                <div class="clip-title">${clip.title}</div>
                <div class="clip-caption-container">
                    <div class="clip-caption">${clip.caption}</div>
                    <button class="btn btn-tiny btn-copy" onclick="clipzAI.copyClipCaption(${clip.id})" title="Copy Caption">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="clip-meta">
                    <div class="clip-timing">
                        <small>${clip.startTime} - ${clip.endTime}</small>
                    </div>
                    ${clip.viralScore ? `
                        <div class="viral-score">
                            <span class="viral-label">Viral Score:</span>
                            <span class="viral-value">${Math.round(clip.viralScore * 100)}%</span>
                            <div class="viral-bar">
                                <div class="viral-fill" style="width: ${clip.viralScore * 100}%"></div>
                            </div>
                        </div>
                    ` : ''}
                    ${clip.pattern ? `
                        <div class="viral-pattern">
                            <span class="pattern-label">Pattern:</span>
                            <span class="pattern-value">${clip.pattern.type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                    ` : ''}
                </div>
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

    async previewClip(clipId) {
        const clip = this.generatedClips.find(c => c.id === clipId);
        if (!clip) return;

        this.previewClip = clip;
        
        // Show modal
        document.getElementById('previewModal').classList.remove('hidden');
        
        // Update modal content
        document.getElementById('previewTitle').textContent = 'Clip Preview';
        document.getElementById('previewClipTitle').textContent = clip.title;
        document.getElementById('previewCaption').textContent = clip.caption;
        document.getElementById('previewStartTime').textContent = clip.startTime;
        document.getElementById('previewEndTime').textContent = clip.endTime;
        
        // Generate preview video (in real implementation, this would be the actual clip)
        await this.generatePreviewVideo(clip);
    }

    async generatePreviewVideo(clip) {
        const video = document.getElementById('previewVideo');
        
        try {
            // Try to generate actual clip first
            if (this.currentVideo && this.currentVideo.url) {
                const response = await fetch('/api/generate-clip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        videoPath: this.currentVideo.url,
                        startTime: clip.startSeconds || this.timeToSeconds(clip.startTime),
                        endTime: clip.endSeconds || this.timeToSeconds(clip.endTime),
                        clipId: clip.id
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.clipPath) {
                        video.src = result.clipPath;
                        video.style.display = 'block';
                        return;
                    }
                }
            }
            
            // Fallback to original video with time constraints
            if (this.currentVideo && this.currentVideo.url) {
                video.src = this.currentVideo.url;
                video.currentTime = this.timeToSeconds(clip.startTime);
                
                // Set up video to play only the clip segment
                video.addEventListener('loadedmetadata', () => {
                    const startTime = this.timeToSeconds(clip.startTime);
                    const endTime = this.timeToSeconds(clip.endTime);
                    
                    video.currentTime = startTime;
                    
                    video.addEventListener('timeupdate', () => {
                        if (video.currentTime >= endTime) {
                            video.pause();
                            video.currentTime = startTime;
                        }
                    });
                });
                
                video.style.display = 'block';
            } else {
                throw new Error('No video source available');
            }
            
        } catch (error) {
            console.error('Error loading preview video:', error);
            // Show placeholder if video can't be loaded
            video.style.display = 'none';
            document.querySelector('.preview-video-container').innerHTML = `
                <div style="padding: 60px; text-align: center; background: #f8f9fa; border-radius: 10px;">
                    <i class="fas fa-video" style="font-size: 4rem; color: #667eea; margin-bottom: 20px;"></i>
                    <h4>Preview Ready</h4>
                    <p>Clip: ${clip.startTime} - ${clip.endTime}</p>
                    <p><em>Generating video preview...</em></p>
                </div>
            `;
        }
    }

    timeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
        return 0;
    }

    closePreview() {
        document.getElementById('previewModal').classList.add('hidden');
        this.previewClip = null;
        
        // Reset video
        const video = document.getElementById('previewVideo');
        video.pause();
        video.currentTime = 0;
        video.src = '';
    }

    async downloadPreviewClip() {
        if (this.previewClip) {
            await this.downloadClip(this.previewClip.id);
            this.closePreview();
        }
    }

    uploadPreviewClip() {
        if (this.previewClip) {
            this.selectedClip = this.previewClip;
            this.closePreview();
            // Show social media upload options
            document.getElementById('socialSection').scrollIntoView({ behavior: 'smooth' });
        }
    }

    async copyCaption() {
        if (!this.previewClip) return;
        
        const caption = this.previewClip.caption;
        await this.copyToClipboard(caption, 'Caption copied to clipboard!');
    }

    async copyClipCaption(clipId) {
        const clip = this.generatedClips.find(c => c.id === clipId);
        if (!clip) return;
        
        const caption = clip.caption;
        await this.copyToClipboard(caption, 'Caption copied to clipboard!');
        
        // Visual feedback on the button
        const button = event.target.closest('.btn-copy');
        if (button) {
            button.classList.add('copied');
            setTimeout(() => {
                button.classList.remove('copied');
            }, 1000);
        }
    }

    async copyToClipboard(text, message) {
        try {
            // Use the modern clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            this.showCopyNotification(message);
        } catch (error) {
            console.error('Failed to copy text: ', error);
            this.showCopyNotification('Failed to copy. Please try again.');
        }
    }

    showCopyNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    async connectSocial(platform) {
        const card = document.querySelector(`[data-platform="${platform}"]`);
        const button = card.querySelector('.btn-connect');
        const status = card.querySelector('.connection-status');
        
        // Set connecting state
        card.classList.add('connecting');
        button.classList.add('connecting');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        status.textContent = 'Connecting...';
        status.className = 'connection-status connecting';
        
        // Update header status
        this.setHeaderStatus(platform, 'connecting');
        
        try {
            // Simulate connection process
            await this.simulateSocialConnection(platform);
            
            // Set connected state
            this.connectedPlatforms[platform] = true;
            card.classList.remove('connecting');
            card.classList.add('connected');
            button.classList.remove('connecting');
            button.classList.add('connected');
            button.innerHTML = '<i class="fas fa-unlink"></i> Disconnect';
            button.onclick = () => this.disconnectSocial(platform);
            status.textContent = 'Connected';
            status.className = 'connection-status connected';
            
            // Update header status
            this.setHeaderStatus(platform, 'connected');
            
            // Save connection status
            this.saveConnectionStatus();
            
            this.showCopyNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
            
        } catch (error) {
            console.error(`Error connecting to ${platform}:`, error);
            
            // Reset to disconnected state
            card.classList.remove('connecting');
            button.classList.remove('connecting');
            button.innerHTML = '<i class="fas fa-link"></i> Connect';
            status.textContent = 'Connection Failed';
            status.className = 'connection-status disconnected';
            
            // Update header status
            this.setHeaderStatus(platform, 'disconnected');
            
            this.showCopyNotification(`Failed to connect to ${platform}. Please try again.`);
        }
    }

    async simulateSocialConnection(platform) {
        // Simulate connection process with different platforms
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Connection failed'));
                }
            }, 2000);
        });
    }

    loadConnectionStatus() {
        // Load saved connection status from localStorage
        const saved = localStorage.getItem('clipz_social_connections');
        if (saved) {
            try {
                this.connectedPlatforms = JSON.parse(saved);
                this.updateConnectionUI();
            } catch (error) {
                console.error('Error loading connection status:', error);
            }
        }
    }

    saveConnectionStatus() {
        // Save connection status to localStorage
        localStorage.setItem('clipz_social_connections', JSON.stringify(this.connectedPlatforms));
    }

    updateConnectionUI() {
        Object.keys(this.connectedPlatforms).forEach(platform => {
            if (this.connectedPlatforms[platform]) {
                const card = document.querySelector(`[data-platform="${platform}"]`);
                const button = card.querySelector('.btn-connect');
                const status = card.querySelector('.connection-status');
                
                card.classList.add('connected');
                button.classList.add('connected');
                button.innerHTML = '<i class="fas fa-unlink"></i> Disconnect';
                button.onclick = () => this.disconnectSocial(platform);
                status.textContent = 'Connected';
                status.className = 'connection-status connected';
            }
        });
        
        // Update header status indicators
        this.updateHeaderStatus();
    }

    updateHeaderStatus() {
        Object.keys(this.connectedPlatforms).forEach(platform => {
            const headerStatus = document.querySelector(`.platform-status[data-platform="${platform}"] .status-dot`);
            if (headerStatus) {
                if (this.connectedPlatforms[platform]) {
                    headerStatus.className = 'status-dot connected';
                } else {
                    headerStatus.className = 'status-dot disconnected';
                }
            }
        });
    }

    setHeaderStatus(platform, status) {
        const headerStatus = document.querySelector(`.platform-status[data-platform="${platform}"] .status-dot`);
        if (headerStatus) {
            headerStatus.className = `status-dot ${status}`;
        }
    }

    disconnectSocial(platform) {
        const card = document.querySelector(`[data-platform="${platform}"]`);
        const button = card.querySelector('.btn-connect');
        const status = card.querySelector('.connection-status');
        
        this.connectedPlatforms[platform] = false;
        card.classList.remove('connected');
        button.classList.remove('connected');
        button.innerHTML = '<i class="fas fa-link"></i> Connect';
        button.onclick = () => this.connectSocial(platform);
        status.textContent = 'Not Connected';
        status.className = 'connection-status disconnected';
        
        // Update header status
        this.setHeaderStatus(platform, 'disconnected');
        
        this.saveConnectionStatus();
        this.showCopyNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected.`);
    }

    async downloadClip(clipId) {
        const clip = this.generatedClips.find(c => c.id === clipId);
        if (!clip) return;

        try {
            this.showProgress('Generating clip for download...', 50);
            
            // Generate the actual clip
            const response = await fetch('/api/generate-clip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoPath: this.currentVideo.url,
                    startTime: clip.startSeconds || this.timeToSeconds(clip.startTime),
                    endTime: clip.endSeconds || this.timeToSeconds(clip.endTime),
                    clipId: clip.id
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.clipPath) {
                    // Create download link
                    const link = document.createElement('a');
                    link.href = result.clipPath;
                    link.download = `${clip.title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    this.showProgress('Download complete!', 100);
                    
                    // Also copy the caption for easy pasting
                    await this.copyToClipboard(clip.caption, 'Clip downloaded and caption copied!');
                    
                    setTimeout(() => this.hideProgress(), 2000);
                } else {
                    throw new Error('No clip path returned');
                }
            } else {
                throw new Error('Failed to generate clip');
            }
            
        } catch (error) {
            console.error('Download error:', error);
            alert(`Error downloading clip: ${error.message}`);
            this.hideProgress();
        }
    }

    async uploadToSocial(platform) {
        if (!this.selectedClip) {
            alert('Please select a clip first by clicking the "Upload" button on a clip');
            return;
        }

        // Check if platform is connected
        if (!this.connectedPlatforms[platform]) {
            alert(`Please connect your ${platform} account first using the connection section above.`);
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

// Production-ready initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add helpful placeholder text
    const urlInput = document.getElementById('videoUrl');
    urlInput.placeholder = 'https://www.youtube.com/watch?v=... or https://www.tiktok.com/@user/video/...';
    
    // Add input validation
    urlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const isValidUrl = url.startsWith('http://') || url.startsWith('https://');
        
        if (url && !isValidUrl) {
            e.target.style.borderColor = '#dc3545';
        } else {
            e.target.style.borderColor = '#e1e5e9';
        }
    });
    
    // Add keyboard shortcut for analyze button
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('analyzeBtn').click();
        }
    });
});
