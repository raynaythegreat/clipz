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
        this.currentUser = null;
        this.authToken = null;
        this.initializeEventListeners();
        this.loadConnectionStatus();
        this.checkAuthStatus();
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeVideo());
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.uploadToSocial(e.target.dataset.platform));
        });
        
        // Add click listeners to connection buttons
        document.querySelectorAll('.btn-connect').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.dataset.platform;
                if (this.connectedPlatforms[platform]) {
                    this.disconnectSocial(platform);
                } else {
                    this.connectSocial(platform);
                }
            });
        });
        
        // Add click listeners to footer status indicators
        document.querySelectorAll('.platform-status').forEach(status => {
            status.addEventListener('click', () => {
                document.querySelector('.social-connection-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
        
        // Add click listeners to authentication buttons
        document.getElementById('showLoginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('showSignupBtn').addEventListener('click', () => this.showSignupModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('dashboardBtn').addEventListener('click', () => this.showDashboard());
        document.getElementById('closeLoginModal').addEventListener('click', () => this.closeLoginModal());
        document.getElementById('closeSignupModal').addEventListener('click', () => this.closeSignupModal());
        
        // Add form submit listeners
        document.getElementById('loginForm').addEventListener('submit', (e) => this.login(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.signup(e));
        
        // Add auth switch listeners
        document.getElementById('switchToSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToSignup();
        });
        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToLogin();
        });
        
        // Add click outside to close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
        
        // Add escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    async analyzeVideo() {
        const url = document.getElementById('videoUrl').value.trim();
        if (!url) {
            alert('Please enter a video URL');
            return;
        }

        // Get selected clip duration
        const selectedDuration = document.querySelector('input[name="clipDuration"]:checked').value;
        const durationSeconds = parseInt(selectedDuration);

        this.showProgress('Analyzing video...', 20);
        
        try {
            // Simulate video analysis (in real implementation, this would call your backend)
            const videoInfo = await this.extractVideoInfo(url);
            this.currentVideo = videoInfo;
            this.displayVideoInfo(videoInfo);
            this.showProgress(`Generating ${durationSeconds}s clips...`, 60);
            
            // Generate clips with specified duration
            const clips = await this.generateClips(videoInfo, durationSeconds);
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

    async generateClips(videoInfo, durationSeconds = 30) {
        try {
            const response = await fetch('/api/generate-clips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    videoUrl: videoInfo.url,
                    videoInfo: videoInfo,
                    duration: durationSeconds
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
                    const clips = this.generateMockClips(videoInfo, durationSeconds);
                    resolve(clips);
                }, 2000);
            });
        }
    }

    generateMockClips(videoInfo, durationSeconds) {
        const durationLabel = durationSeconds === 30 ? '30s' : durationSeconds === 60 ? '1m' : '2m';
        
        return [
            {
                id: 1,
                title: `Hook: The Secret to Viral Content (${durationLabel})`,
                startTime: "0:15",
                endTime: this.formatTime(15 + durationSeconds),
                duration: `${durationSeconds}s`,
                caption: `🔥 The secret to viral content isn't what you think! This ${durationLabel} technique changed everything for me...`,
                thumbnail: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Clip+1",
                viralScore: 0.85
            },
            {
                id: 2,
                title: `Key Insight: Content Strategy (${durationLabel})`,
                startTime: "3:20",
                endTime: this.formatTime(200 + durationSeconds),
                duration: `${durationSeconds}s`,
                caption: `💡 Here's the content strategy that got me 1M+ views. Most creators are doing this wrong... This ${durationLabel} clip reveals all!`,
                thumbnail: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Clip+2",
                viralScore: 0.72
            },
            {
                id: 3,
                title: `Call to Action: Engagement Tips (${durationLabel})`,
                startTime: "8:45",
                endTime: this.formatTime(525 + durationSeconds),
                duration: `${durationSeconds}s`,
                caption: `🚀 Want more engagement? Try this simple trick that increased my comments by 300%... This ${durationLabel} method works every time!`,
                thumbnail: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=Clip+3",
                viralScore: 0.68
            }
        ];
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    displayClips(clips) {
        const clipsContainer = document.getElementById('clipsContainer');
        const historyContainer = document.getElementById('historyContainer');
        
        // Clear both containers
        clipsContainer.innerHTML = '';
        historyContainer.innerHTML = '';
        
        if (clips.length === 0) {
            clipsContainer.innerHTML = '<p class="no-clips">No clips generated yet. Analyze a video to get started!</p>';
            historyContainer.innerHTML = '<p class="no-clips">No clip history yet. Generate some clips to see them here!</p>';
            return;
        }
        
        // Display recent clips in main section (last 3)
        const recentClips = clips.slice(-3);
        recentClips.forEach(clip => {
            const clipCard = this.createClipCard(clip);
            clipsContainer.appendChild(clipCard);
        });
        
        // Display all clips in history section
        clips.forEach(clip => {
            const clipCard = this.createClipCard(clip, true); // true for history version
            historyContainer.appendChild(clipCard);
        });

        document.getElementById('clipsSection').classList.remove('hidden');
        document.getElementById('socialSection').classList.remove('hidden');
    }
    
    createClipCard(clip, isHistory = false) {
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
        
        const createdAt = isHistory ? `<div class="clip-date"><small>Created: ${new Date(clip.createdAt).toLocaleDateString()}</small></div>` : '';
        const deleteButton = isHistory ? `<button class="btn btn-small btn-danger" onclick="clipzAI.deleteClip('${clip.id}')">
            <i class="fas fa-trash"></i> Delete
        </button>` : '';
        
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
                ${createdAt}
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
                ${deleteButton}
            </div>
        `;
        return clipCard;
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

    showCopyNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `copy-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    // Authentication Methods
    async checkAuthStatus() {
        const token = localStorage.getItem('clipz_auth_token');
        if (token) {
            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.authToken = token;
                    this.updateAuthUI();
                    
                    // Load social connection status for authenticated users
                    await this.loadSocialConnections();
                    
                    // Load user's clips history
                    await this.loadUserClips();
                    
                    // Show welcome back message
                    this.showCopyNotification(`Welcome back, ${this.currentUser.username}!`);
                } else if (response.status === 401) {
                    // Token expired, try to refresh
                    await this.refreshToken();
                } else {
                    localStorage.removeItem('clipz_auth_token');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('clipz_auth_token');
            }
        }
    }
    
    async refreshToken() {
        try {
            const response = await fetch('/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.authToken = data.token;
                localStorage.setItem('clipz_auth_token', data.token);
                this.updateAuthUI();
                await this.loadSocialConnections();
                await this.loadUserClips();
            } else {
                localStorage.removeItem('clipz_auth_token');
                this.currentUser = null;
                this.authToken = null;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            localStorage.removeItem('clipz_auth_token');
            this.currentUser = null;
            this.authToken = null;
        }
    }
    
    async loadSocialConnections() {
        try {
            const response = await fetch('/api/social-accounts', {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.connectedPlatforms = data;
                this.updateConnectionUI();
            }
        } catch (error) {
            console.error('Error loading social connections:', error);
        }
    }
    
    async loadUserClips() {
        try {
            const response = await fetch('/api/my-clips', {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.generatedClips = data;
                this.displayClips(data);
            }
        } catch (error) {
            console.error('Error loading user clips:', error);
        }
    }

    updateAuthUI() {
        if (this.currentUser) {
            document.getElementById('userInfo').style.display = 'flex';
            document.getElementById('authButtons').style.display = 'none';
            document.getElementById('username').textContent = this.currentUser.username;
            document.getElementById('authRequiredNotice').classList.add('hidden');
            document.getElementById('userHistorySection').classList.remove('hidden');
            document.getElementById('dashboardSection').classList.remove('hidden');
        } else {
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('authButtons').style.display = 'flex';
            document.getElementById('authRequiredNotice').classList.remove('hidden');
            document.getElementById('userHistorySection').classList.add('hidden');
            document.getElementById('dashboardSection').classList.add('hidden');
        }
    }

    showLoginModal() {
        this.closeAllModals();
        document.getElementById('loginModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeLoginModal() {
        document.getElementById('loginModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.clearLoginForm();
    }

    showSignupModal() {
        this.closeAllModals();
        document.getElementById('signupModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeSignupModal() {
        document.getElementById('signupModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.clearSignupForm();
    }

    closeAllModals() {
        this.closeLoginModal();
        this.closeSignupModal();
    }

    clearLoginForm() {
        document.getElementById('loginForm').reset();
    }

    clearSignupForm() {
        document.getElementById('signupForm').reset();
    }

    switchToSignup() {
        this.closeLoginModal();
        this.showSignupModal();
    }

    switchToLogin() {
        this.closeSignupModal();
        this.showLoginModal();
    }

    async login(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const submitBtn = event.target.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!email || !password) {
            this.showCopyNotification('Please fill in all fields');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showCopyNotification('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.currentUser = data.user;
                this.authToken = data.token;
                localStorage.setItem('clipz_auth_token', data.token);
                this.updateAuthUI();
                this.closeLoginModal();
                this.showCopyNotification('Login successful! Welcome back!');
            } else {
                if (data.requiresVerification) {
                    this.closeLoginModal();
                    this.showEmailVerificationModal(data.email);
                    this.showCopyNotification('Please verify your email address before logging in.', 'warning');
                } else {
                    this.showCopyNotification(data.error || 'Login failed. Please check your credentials.', 'error');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showCopyNotification('Login failed. Please check your internet connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async signup(event) {
        event.preventDefault();
        
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const submitBtn = event.target.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!username || !email || !password) {
            this.showCopyNotification('Please fill in all fields');
            return;
        }
        
        if (username.length < 3) {
            this.showCopyNotification('Username must be at least 3 characters long');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showCopyNotification('Please enter a valid email address');
            return;
        }
        
        if (password.length < 6) {
            this.showCopyNotification('Password must be at least 6 characters long');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (data.requiresVerification) {
                    this.closeSignupModal();
                    this.showEmailVerificationModal(data.email);
                    this.showCopyNotification('Account created! Please check your email to verify your account.', 'success');
                } else {
                    this.currentUser = data.user;
                    this.authToken = data.token;
                    localStorage.setItem('clipz_auth_token', data.token);
                    this.updateAuthUI();
                    this.closeSignupModal();
                    this.showCopyNotification('Account created successfully! Welcome to Clipz AI!');
                }
            } else {
                this.showCopyNotification(data.error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showCopyNotification('Registration failed. Please check your internet connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    logout() {
        this.currentUser = null;
        this.authToken = null;
        localStorage.removeItem('clipz_auth_token');
        this.connectedPlatforms = {
            tiktok: false,
            instagram: false,
            youtube: false
        };
        this.updateAuthUI();
        this.updateConnectionUI();
        this.showCopyNotification('Logged out successfully');
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getAuthHeaders() {
        if (!this.authToken) {
            throw new Error('Not authenticated');
        }
        return {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        };
    }

    async connectSocial(platform) {
        // Check if user is authenticated
        if (!this.currentUser) {
            this.showCopyNotification('Please login to connect social media accounts');
            this.showLoginModal();
            return;
        }
        
        const card = document.querySelector(`[data-platform="${platform}"]`);
        const button = card.querySelector('.btn-connect');
        const status = card.querySelector('.connection-status');
        
        // Set connecting state
        card.classList.add('connecting');
        button.classList.add('connecting');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        status.textContent = 'Connecting...';
        status.className = 'connection-status connecting';
        
        // Update footer status
        this.setFooterStatus(platform, 'connecting');
        
        try {
            // Get OAuth URL from backend
            const response = await fetch(`/api/auth/${platform}`, {
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to get auth URL');
            }
            
            const data = await response.json();
            
            // Open OAuth window
            const authWindow = window.open(
                data.authUrl,
                `${platform}_auth`,
                'width=600,height=700,scrollbars=yes,resizable=yes'
            );
            
            // Listen for OAuth completion
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    this.checkSocialConnectionStatus(platform);
                }
            }, 1000);
            
        } catch (error) {
            console.error(`Error connecting to ${platform}:`, error);
            
            // Reset to disconnected state
            card.classList.remove('connecting');
            button.classList.remove('connecting');
            button.innerHTML = '<i class="fas fa-link"></i> Connect';
            status.textContent = 'Connection Failed';
            status.className = 'connection-status disconnected';
            
            // Update footer status
            this.setFooterStatus(platform, 'disconnected');
            
            this.showCopyNotification(`Failed to connect to ${platform}. Please try again.`);
        }
    }

    async checkSocialConnectionStatus(platform) {
        try {
            const response = await fetch('/api/social-accounts', {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.connectedPlatforms = data;
                this.updateConnectionUI();
            }
        } catch (error) {
            console.error('Error checking connection status:', error);
        }
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
                status.textContent = 'Connected';
                status.className = 'connection-status connected';
            }
        });
        
        // Update footer status indicators
        this.updateFooterStatus();
    }

    updateFooterStatus() {
        Object.keys(this.connectedPlatforms).forEach(platform => {
            const footerStatus = document.querySelector(`.platform-status[data-platform="${platform}"] .status-dot`);
            if (footerStatus) {
                if (this.connectedPlatforms[platform]) {
                    footerStatus.className = 'status-dot connected';
                } else {
                    footerStatus.className = 'status-dot disconnected';
                }
            }
        });
    }

    setFooterStatus(platform, status) {
        const footerStatus = document.querySelector(`.platform-status[data-platform="${platform}"] .status-dot`);
        if (footerStatus) {
            footerStatus.className = `status-dot ${status}`;
        }
    }

    async disconnectSocial(platform) {
        if (!this.currentUser) {
            this.showCopyNotification('Please login to manage social media connections');
            this.showLoginModal();
            return;
        }
        
        try {
            const response = await fetch(`/api/social-accounts/${platform}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                this.connectedPlatforms[platform] = false;
                this.updateConnectionUI();
                this.showCopyNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected successfully.`);
            } else {
                this.showCopyNotification('Failed to disconnect account. Please try again.');
            }
        } catch (error) {
            console.error('Error disconnecting account:', error);
            this.showCopyNotification('Failed to disconnect account. Please try again.');
        }
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
        if (!this.currentUser) {
            this.showCopyNotification('Please login to upload to social media');
            this.showLoginModal();
            return;
        }
        
        if (!this.selectedClip) {
            this.showCopyNotification('Please select a clip first by clicking the "Upload" button on a clip');
            return;
        }

        // Check if platform is connected
        if (!this.connectedPlatforms[platform]) {
            this.showCopyNotification(`Please connect your ${platform} account first using the connection section above.`);
            return;
        }

        this.showProgress(`Uploading to ${platform}...`, 30);

        try {
            // Real upload process with authentication
            await this.uploadToSocialPlatform(platform, this.selectedClip);
            this.showProgress('Upload successful!', 100);
            setTimeout(() => this.hideProgress(), 2000);
        } catch (error) {
            console.error('Upload error:', error);
            this.showCopyNotification(`Error uploading to ${platform}. Please try again.`);
            this.hideProgress();
        }
    }

    async uploadToSocialPlatform(platform, clip) {
        try {
            const response = await fetch('/api/upload-social', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ 
                    platform: platform,
                    clipData: clip
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload to social media');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Upload API error:', error);
            throw error;
        }
    }
    
    async deleteClip(clipId) {
        if (!this.currentUser) {
            this.showCopyNotification('Please login to manage clips', 'error');
            return;
        }
        
        if (!confirm('Are you sure you want to delete this clip? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/clips/${clipId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                // Remove from local array
                this.generatedClips = this.generatedClips.filter(clip => clip.id !== clipId);
                
                // Refresh display
                this.displayClips(this.generatedClips);
                
                this.showCopyNotification('Clip deleted successfully');
            } else {
                this.showCopyNotification('Failed to delete clip', 'error');
            }
        } catch (error) {
            console.error('Delete clip error:', error);
            this.showCopyNotification('Failed to delete clip', 'error');
        }
    }

    // Dashboard Functions
    showDashboard() {
        if (!this.currentUser) {
            this.showCopyNotification('Please login to access dashboard', 'error');
            return;
        }
        
        this.updateDashboard();
        document.getElementById('dashboardSection').classList.remove('hidden');
        document.getElementById('dashboardSection').scrollIntoView({ behavior: 'smooth' });
    }

    updateDashboard() {
        if (!this.currentUser) return;
        
        // Update account information
        document.getElementById('dashboardUsername').textContent = this.currentUser.username;
        document.getElementById('dashboardEmail').textContent = this.currentUser.email;
        document.getElementById('dashboardJoinDate').textContent = new Date(this.currentUser.createdAt).toLocaleDateString();
        document.getElementById('dashboardClipCount').textContent = this.generatedClips.length;
        
        // Update social connections
        this.updateDashboardConnections();
        
        // Load user settings
        this.loadUserSettings();
    }

    updateDashboardConnections() {
        const connectionsContainer = document.getElementById('dashboardConnections');
        const platforms = ['tiktok', 'instagram', 'youtube'];
        
        let connectionsHTML = '';
        platforms.forEach(platform => {
            const isConnected = this.connectedPlatforms.includes(platform);
            const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
            const icon = platform === 'tiktok' ? 'fab fa-tiktok' : 
                        platform === 'instagram' ? 'fab fa-instagram' : 'fab fa-youtube';
            
            connectionsHTML += `
                <div class="connection-item">
                    <div class="connection-info">
                        <i class="${icon}"></i>
                        <span>${platformName}</span>
                    </div>
                    <div class="connection-status-badge ${isConnected ? 'connected' : 'disconnected'}">
                        ${isConnected ? 'Connected' : 'Not Connected'}
                    </div>
                </div>
            `;
        });
        
        connectionsContainer.innerHTML = connectionsHTML;
    }

    loadUserSettings() {
        // Load settings from localStorage
        const autoSave = localStorage.getItem('clipz_auto_save') !== 'false';
        const askBeforeSave = localStorage.getItem('clipz_ask_before_save') === 'true';
        const autoCleanup = localStorage.getItem('clipz_auto_cleanup') === 'true';
        
        document.getElementById('autoSaveClips').checked = autoSave;
        document.getElementById('askBeforeSave').checked = askBeforeSave;
        document.getElementById('autoCleanup').checked = autoCleanup;
        
        // Add event listeners for settings
        document.getElementById('autoSaveClips').addEventListener('change', (e) => {
            localStorage.setItem('clipz_auto_save', e.target.checked);
            this.showCopyNotification('Settings saved!');
        });
        
        document.getElementById('askBeforeSave').addEventListener('change', (e) => {
            localStorage.setItem('clipz_ask_before_save', e.target.checked);
            this.showCopyNotification('Settings saved!');
        });
        
        document.getElementById('autoCleanup').addEventListener('change', (e) => {
            localStorage.setItem('clipz_auto_cleanup', e.target.checked);
            this.showCopyNotification('Settings saved!');
        });
    }

    showSocialConnectModal() {
        // Show a modal to select which platform to connect
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Connect Social Media Platform</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="platform-selection">
                        <button class="btn btn-primary platform-btn" data-platform="tiktok">
                            <i class="fab fa-tiktok"></i> Connect TikTok
                        </button>
                        <button class="btn btn-primary platform-btn" data-platform="instagram">
                            <i class="fab fa-instagram"></i> Connect Instagram
                        </button>
                        <button class="btn btn-primary platform-btn" data-platform="youtube">
                            <i class="fab fa-youtube"></i> Connect YouTube
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelectorAll('.platform-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.closest('.platform-btn').dataset.platform;
                this.connectSocial(platform);
                modal.remove();
            });
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Enhanced clip saving with user choice
    async saveClipWithChoice(clip) {
        const autoSave = localStorage.getItem('clipz_auto_save') !== 'false';
        const askBeforeSave = localStorage.getItem('clipz_ask_before_save') === 'true';
        
        if (autoSave && !askBeforeSave) {
            // Auto-save without asking
            await this.saveClipToHistory(clip);
            return true;
        } else if (askBeforeSave) {
            // Ask user before saving
            const shouldSave = confirm(`Save this clip to your history?\n\nTitle: ${clip.title}\nDuration: ${clip.duration}\nViral Score: ${Math.round(clip.viralScore * 100)}%`);
            if (shouldSave) {
                await this.saveClipToHistory(clip);
                return true;
            } else {
                // Auto-cleanup if enabled
                const autoCleanup = localStorage.getItem('clipz_auto_cleanup') === 'true';
                if (autoCleanup) {
                    await this.deleteClip(clip.id);
                }
                return false;
            }
        }
        
        return false;
    }

    async saveClipToHistory(clip) {
        try {
            const response = await fetch('/api/save-clip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify(clip)
            });
            
            if (response.ok) {
                this.showCopyNotification('Clip saved to history!');
                this.loadUserClips(); // Refresh the history
            } else {
                this.showCopyNotification('Failed to save clip', 'error');
            }
        } catch (error) {
            console.error('Save clip error:', error);
            this.showCopyNotification('Failed to save clip', 'error');
        }
    }

    // Email verification functions
    showEmailVerificationModal(email) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'emailVerificationModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-envelope"></i> Verify Your Email</h3>
                    <span class="close" onclick="clipzAI.closeEmailVerificationModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="verification-content">
                        <div class="verification-icon">
                            <i class="fas fa-envelope-open-text"></i>
                        </div>
                        <h4>Check Your Email</h4>
                        <p>We've sent a verification link to:</p>
                        <p class="email-address">${email}</p>
                        <p>Click the link in the email to verify your account and start using Clipz AI!</p>
                        
                        <div class="verification-actions">
                            <button class="btn btn-primary" onclick="clipzAI.resendVerificationEmail('${email}')">
                                <i class="fas fa-paper-plane"></i> Resend Email
                            </button>
                            <button class="btn btn-secondary" onclick="clipzAI.closeEmailVerificationModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                        
                        <div class="verification-help">
                            <p><i class="fas fa-info-circle"></i> <strong>Didn't receive the email?</strong></p>
                            <ul>
                                <li>Check your spam/junk folder</li>
                                <li>Make sure the email address is correct</li>
                                <li>Wait a few minutes and try resending</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    closeEmailVerificationModal() {
        const modal = document.getElementById('emailVerificationModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }

    async resendVerificationEmail(email) {
        try {
            const response = await fetch('/api/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showCopyNotification('Verification email sent successfully!', 'success');
            } else {
                this.showCopyNotification(data.error || 'Failed to resend verification email', 'error');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            this.showCopyNotification('Failed to resend verification email', 'error');
        }
    }

    // Handle email verification from URL
    async handleEmailVerification() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            try {
                const response = await fetch(`/api/verify-email?token=${token}`);
                const data = await response.json();
                
                if (response.ok) {
                    // Store user data and token
                    this.currentUser = data.user;
                    this.authToken = data.token;
                    localStorage.setItem('clipz_auth_token', data.token);
                    this.updateAuthUI();
                    
                    // Show success message
                    this.showCopyNotification('Email verified successfully! Welcome to Clipz AI!', 'success');
                    
                    // Clean up URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
                    this.showCopyNotification(data.error || 'Email verification failed', 'error');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                this.showCopyNotification('Email verification failed', 'error');
            }
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
    
    // Handle email verification from URL
    clipzAI.handleEmailVerification();
    
    // Initialize authentication
    clipzAI.checkAuthStatus();
});
