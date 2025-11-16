// PixelTunes Web - Main Application JavaScript

class PixelTunesPlayer {
    constructor() {
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.audioPlayer = document.getElementById('audioPlayer');
        this.isUserSeeking = false;
        this.isShuffle = false;
        this.repeatMode = 'off'; // 'off', 'all', 'one'
        this.isMuted = false;
        this.lastVolume = 100;
        
        // Audio Context for visualizer
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        
        this.initializeElements();
        this.loadPlaylistFromStorage();
        this.setupEventListeners();
        this.setupAudioEventListeners();
        this.setupDragAndDrop();
        this.applyTheme();
        this.initializeAudioVisualizer();
        
        // Initialize vinyl player
        this.vinylPlayer = new VinylPlayer(
            this.audioPlayer,
            () => this.playlist,
            () => this.currentIndex,
            (time) => { this.audioPlayer.currentTime = time; },
            (shouldPlay) => {
                if (shouldPlay === undefined) {
                    this.togglePlayPause();
                } else if (shouldPlay && this.audioPlayer.paused) {
                    this.audioPlayer.play();
                    this.isPlaying = true;
                } else if (!shouldPlay && !this.audioPlayer.paused) {
                    this.audioPlayer.pause();
                    this.isPlaying = false;
                }
            },
            () => this.playPrevious(),
            () => this.playNext()
        );
        
        // Register service worker for offline support
        this.registerServiceWorker();
    }
    
    initializeElements() {
        // Sections
        this.uploadSection = document.getElementById('uploadSection');
        this.playerSection = document.getElementById('playerSection');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        // Controls
        this.btnPlayPause = document.getElementById('btnPlayPause');
        this.btnPrevious = document.getElementById('btnPrevious');
        this.btnNext = document.getElementById('btnNext');
        this.btnShuffle = document.getElementById('btnShuffle');
        this.btnRepeat = document.getElementById('btnRepeat');
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        
        // Volume controls
        this.btnMute = document.getElementById('btnMute');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.muteIcon = document.getElementById('muteIcon');
        
        // Visualizer
        this.visualizerCanvas = document.getElementById('visualizer');
        
        // Song Info
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.albumName = document.getElementById('albumName');
        this.yearText = document.getElementById('yearText');
        this.albumArt = document.getElementById('albumArt');
        
        // Progress
        this.seekBar = document.getElementById('seekBar');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        
        // Upload
        this.fileInput = document.getElementById('fileInput');
        this.folderInput = document.getElementById('folderInput');
        this.uploadFilesBtn = document.getElementById('uploadFilesBtn');
        this.uploadFolderBtn = document.getElementById('uploadFolderBtn');
        
        // Playlist
        this.playlistModal = document.getElementById('playlistModal');
        this.playlistBtn = document.getElementById('playlistBtn');
        this.closePlaylist = document.getElementById('closePlaylist');
        this.playlistContainer = document.getElementById('playlistContainer');
        this.clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
        this.uploadMoreBtn = document.getElementById('uploadMoreBtn');
        
        // Theme and Help
        this.themeToggle = document.getElementById('themeToggle');
        this.helpBtn = document.getElementById('helpBtn');
        this.helpModal = document.getElementById('helpModal');
        this.closeHelp = document.getElementById('closeHelp');
        
        // Toast
        this.toast = document.getElementById('toast');
    }
    
    setupEventListeners() {
        // Playback controls
        this.btnPlayPause.addEventListener('click', () => this.togglePlayPause());
        this.btnPrevious.addEventListener('click', () => this.playPrevious());
        this.btnNext.addEventListener('click', () => this.playNext());
        this.btnShuffle?.addEventListener('click', () => this.toggleShuffle());
        this.btnRepeat?.addEventListener('click', () => this.cycleRepeatMode());
        
        // Volume controls
        this.btnMute?.addEventListener('click', () => this.toggleMute());
        this.volumeSlider?.addEventListener('input', (e) => this.updateVolume(e.target.value));
        
        // Seek bar
        this.seekBar.addEventListener('input', () => {
            this.isUserSeeking = true;
            const position = (this.audioPlayer.duration * this.seekBar.value) / 100;
            this.currentTime.textContent = this.formatTime(position);
        });
        
        this.seekBar.addEventListener('change', () => {
            this.isUserSeeking = false;
            const position = (this.audioPlayer.duration * this.seekBar.value) / 100;
            this.audioPlayer.currentTime = position;
        });
        
        // Upload
        this.uploadFilesBtn.addEventListener('click', () => this.fileInput.click());
        this.uploadFolderBtn.addEventListener('click', () => this.folderInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.folderInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Playlist
        this.playlistBtn.addEventListener('click', () => this.showPlaylist());
        this.uploadMoreBtn.addEventListener('click', () => this.showUploadSection());
        this.closePlaylist.addEventListener('click', () => this.hidePlaylist());
        this.clearPlaylistBtn.addEventListener('click', () => this.clearPlaylist());
        
        // Close modal on outside click
        this.playlistModal.addEventListener('click', (e) => {
            if (e.target === this.playlistModal) {
                this.hidePlaylist();
            }
        });
        
        this.helpModal?.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideHelp();
            }
        });
        
        // Theme toggle and Help
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.helpBtn?.addEventListener('click', () => this.showHelp());
        this.closeHelp?.addEventListener('click', () => this.hideHelp());
        
        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Skip if typing in an input
            if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
            
            switch(e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 5);
                    this.showToast('⏪ -5s');
                    break;
                case 'arrowright':
                    e.preventDefault();
                    this.audioPlayer.currentTime = Math.min(this.audioPlayer.duration, this.audioPlayer.currentTime + 5);
                    this.showToast('⏩ +5s');
                    break;
                case 'arrowup':
                    e.preventDefault();
                    this.updateVolume(Math.min(100, parseInt(this.volumeSlider.value) + 10));
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    this.updateVolume(Math.max(0, parseInt(this.volumeSlider.value) - 10));
                    break;
                case 'm':
                    this.toggleMute();
                    break;
                case 's':
                    this.toggleShuffle();
                    break;
                case 'r':
                    this.cycleRepeatMode();
                    break;
                case 'n':
                    this.playNext();
                    break;
                case 'p':
                    this.playPrevious();
                    break;
                case '?':
                    this.showHelp();
                    break;
                case 'escape':
                    this.hideHelp();
                    this.hidePlaylist();
                    break;
            }
        });
    }
    
    setupAudioEventListeners() {
        this.audioPlayer.addEventListener('timeupdate', () => {
            if (!this.isUserSeeking && this.audioPlayer.duration) {
                const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                this.seekBar.value = progress;
                this.currentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
            }
        });
        
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.totalTime.textContent = this.formatTime(this.audioPlayer.duration);
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.playNext();
        });
        
        this.audioPlayer.addEventListener('play', () => {
            this.updatePlayPauseButton(true);
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            this.updatePlayPauseButton(false);
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            this.showError('Error playing audio file');
        });
    }
    
    setupDragAndDrop() {
        const uploadCard = document.querySelector('.upload-card');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadCard.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadCard.addEventListener(eventName, () => {
                uploadCard.classList.add('drag-over');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadCard.addEventListener(eventName, () => {
                uploadCard.classList.remove('drag-over');
            });
        });
        
        uploadCard.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            this.processFiles(files);
        });
    }
    
    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        await this.processFiles(files);
        // Reset input
        event.target.value = '';
    }
    
    async processFiles(files) {
        this.showLoading();
        
        const audioFiles = files.filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            return ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac'].includes(ext);
        });
        
        if (audioFiles.length === 0) {
            this.hideLoading();
            this.showError('No supported audio files found');
            return;
        }
        
        for (const file of audioFiles) {
            await this.addSongToPlaylist(file);
        }
        
        this.hideLoading();
        this.savePlaylistToStorage();
        this.updatePlaylistUI();
        
        if (this.playlist.length > 0) {
            this.showPlayerSection();
            if (!this.isPlaying) {
                this.loadSong(0);
            }
        }
    }
    
    async addSongToPlaylist(file) {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            
            audio.addEventListener('loadedmetadata', () => {
                const song = {
                    id: Date.now() + Math.random(),
                    title: this.extractTitle(file.name),
                    artist: 'Unknown Artist',
                    album: 'Unknown Album',
                    duration: audio.duration,
                    year: '',
                    file: file,
                    url: url,
                    size: file.size
                };
                
                this.playlist.push(song);
                resolve();
            });
            
            audio.addEventListener('error', () => {
                console.error('Error loading metadata for:', file.name);
                resolve();
            });
        });
    }
    
    extractTitle(filename) {
        // Remove file extension
        let title = filename.replace(/\.[^/.]+$/, '');
        
        // Remove common patterns like "01 - " or "01. "
        title = title.replace(/^\d+[\s\-\.]+/, '');
        
        // Replace underscores and hyphens with spaces
        title = title.replace(/[_-]/g, ' ');
        
        return title.trim() || filename;
    }
    
    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentIndex = index;
        const song = this.playlist[index];
        
        this.audioPlayer.src = song.url;
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.albumName.textContent = song.album;
        this.yearText.textContent = song.year || '';
        
        // Set default album art
        this.albumArt.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23BFD5CC'/%3E%3Ctext x='50%25' y='50%25' font-family='VT323' font-size='48' fill='%232A5E75' text-anchor='middle' dominant-baseline='middle'%3EPIXELTUNES%3C/text%3E%3C/svg%3E";
        
        this.updatePlaylistUI();
        
        // Notify vinyl player of song change
        if (this.vinylPlayer) {
            this.vinylPlayer.onSongChange();
        }
    }
    
    togglePlayPause() {
        if (this.playlist.length === 0) return;
        
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
            this.isPlaying = true;
        } else {
            this.audioPlayer.pause();
            this.isPlaying = false;
        }
    }
    
    playPrevious() {
        if (this.playlist.length === 0) return;
        
        if (this.audioPlayer.currentTime > 3) {
            this.audioPlayer.currentTime = 0;
        } else {
            const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
            this.loadSong(newIndex);
            if (this.isPlaying) {
                this.audioPlayer.play();
            }
        }
    }
    
    playNext() {
        if (this.playlist.length === 0) return;
        
        let newIndex;
        
        if (this.repeatMode === 'one') {
            // Repeat current song
            this.audioPlayer.currentTime = 0;
            if (this.isPlaying) {
                this.audioPlayer.play();
            }
            return;
        }
        
        if (this.isShuffle) {
            // Random next song (excluding current)
            if (this.playlist.length > 1) {
                do {
                    newIndex = Math.floor(Math.random() * this.playlist.length);
                } while (newIndex === this.currentIndex);
            } else {
                newIndex = 0;
            }
        } else {
            // Sequential next
            newIndex = (this.currentIndex + 1) % this.playlist.length;
            
            // If repeat is off and we're at the end, stop
            if (this.repeatMode === 'off' && newIndex === 0 && this.currentIndex === this.playlist.length - 1) {
                this.audioPlayer.pause();
                this.isPlaying = false;
                return;
            }
        }
        
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.audioPlayer.play();
        }
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.btnShuffle.classList.toggle('active', this.isShuffle);
        const message = this.isShuffle ? '🔀 Shuffle ON' : '➡️ Shuffle OFF';
        this.showToast(message);
        localStorage.setItem('pixeltunes_shuffle', this.isShuffle);
    }
    
    cycleRepeatMode() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        // Update button state
        this.btnRepeat.classList.toggle('active', this.repeatMode !== 'off');
        this.btnRepeat.classList.toggle('repeat-one', this.repeatMode === 'one');
        
        // Update aria label and title
        const labels = {
            'off': 'Repeat Off',
            'all': 'Repeat All',
            'one': 'Repeat One'
        };
        const icons = {
            'off': '⤴️ Repeat OFF',
            'all': '🔁 Repeat ALL',
            'one': '🔂 Repeat ONE'
        };
        
        this.btnRepeat.setAttribute('aria-label', labels[this.repeatMode]);
        this.btnRepeat.setAttribute('title', labels[this.repeatMode]);
        this.showToast(icons[this.repeatMode]);
        localStorage.setItem('pixeltunes_repeat', this.repeatMode);
    }
    
    updateVolume(value) {
        value = Math.max(0, Math.min(100, value));
        this.volumeSlider.value = value;
        this.audioPlayer.volume = value / 100;
        this.volumeValue.textContent = value + '%';
        
        // Update mute icon if volume is 0
        if (value === 0) {
            this.isMuted = true;
            this.volumeIcon.style.display = 'none';
            this.muteIcon.style.display = 'block';
        } else {
            this.isMuted = false;
            this.volumeIcon.style.display = 'block';
            this.muteIcon.style.display = 'none';
            this.lastVolume = value;
        }
        
        localStorage.setItem('pixeltunes_volume', value);
    }
    
    toggleMute() {
        if (this.isMuted) {
            // Unmute
            this.updateVolume(this.lastVolume || 100);
            this.showToast('🔊 Unmuted');
        } else {
            // Mute
            this.lastVolume = this.volumeSlider.value;
            this.updateVolume(0);
            this.showToast('🔇 Muted');
        }
    }
    
    initializeAudioVisualizer() {
        if (!this.visualizerCanvas) return;
        
        const canvas = this.visualizerCanvas;
        const canvasCtx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Initialize on first play
        this.audioPlayer.addEventListener('play', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.source = this.audioContext.createMediaElementSource(this.audioPlayer);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                
                this.analyser.fftSize = 64;
                const bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(bufferLength);
                
                this.drawVisualizer(canvasCtx, bufferLength);
            }
        }, { once: true });
    }
    
    drawVisualizer(canvasCtx, bufferLength) {
        const canvas = this.visualizerCanvas;
        const draw = () => {
            requestAnimationFrame(draw);
            
            if (!this.analyser) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Clear canvas with background color
            const isDark = document.body.classList.contains('dark-theme');
            canvasCtx.fillStyle = isDark ? '#1F4A5D' : '#BFD5CC';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw bars
            const barWidth = (canvas.width / bufferLength) * 0.8;
            const gap = (canvas.width / bufferLength) * 0.2;
            
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (this.dataArray[i] / 255) * canvas.height;
                
                // Pixel-perfect colors
                const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2A5E75'];
                const colorIndex = Math.floor((i / bufferLength) * colors.length);
                canvasCtx.fillStyle = colors[colorIndex];
                
                const x = i * (barWidth + gap);
                const y = canvas.height - barHeight;
                
                // Draw pixelated bar
                canvasCtx.fillRect(x, y, barWidth, barHeight);
            }
        };
        
        draw();
    }
    
    showHelp() {
        this.helpModal.classList.add('active');
    }
    
    hideHelp() {
        this.helpModal.classList.remove('active');
    }
    
    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }
    
    updatePlayPauseButton(playing) {
        if (playing) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
            this.btnPlayPause.setAttribute('aria-label', 'Pause');
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
            this.btnPlayPause.setAttribute('aria-label', 'Play');
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showPlayerSection() {
        this.uploadSection.style.display = 'none';
        this.playerSection.style.display = 'flex';
    }
    
    showUploadSection() {
        this.hidePlaylist();
        this.uploadSection.style.display = 'flex';
        this.playerSection.style.display = 'none';
    }
    
    showPlaylist() {
        this.playlistModal.classList.add('active');
        this.updatePlaylistUI();
    }
    
    hidePlaylist() {
        this.playlistModal.classList.remove('active');
    }
    
    updatePlaylistUI() {
        this.playlistContainer.innerHTML = '';
        
        if (this.playlist.length === 0) {
            this.playlistContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No songs in playlist</p>';
            return;
        }
        
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item' + (index === this.currentIndex ? ' active' : '');
            
            item.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${this.escapeHtml(song.title)}</div>
                    <div class="playlist-item-artist">${this.escapeHtml(song.artist)}</div>
                </div>
                <div class="playlist-item-duration">${this.formatTime(song.duration)}</div>
                <button class="playlist-item-delete" aria-label="Remove from playlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            `;
            
            // Click to play
            item.querySelector('.playlist-item-info').addEventListener('click', () => {
                this.loadSong(index);
                this.audioPlayer.play();
                this.isPlaying = true;
                this.hidePlaylist();
            });
            
            // Delete button
            item.querySelector('.playlist-item-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSongFromPlaylist(index);
            });
            
            this.playlistContainer.appendChild(item);
        });
    }
    
    removeSongFromPlaylist(index) {
        // Revoke URL to free memory
        URL.revokeObjectURL(this.playlist[index].url);
        
        this.playlist.splice(index, 1);
        
        // Adjust current index if needed
        if (index < this.currentIndex) {
            this.currentIndex--;
        } else if (index === this.currentIndex) {
            if (this.playlist.length > 0) {
                const newIndex = Math.min(this.currentIndex, this.playlist.length - 1);
                this.loadSong(newIndex);
                if (this.isPlaying) {
                    this.audioPlayer.play();
                }
            } else {
                this.audioPlayer.pause();
                this.audioPlayer.src = '';
                this.isPlaying = false;
                this.showUploadSection();
            }
        }
        
        this.savePlaylistToStorage();
        this.updatePlaylistUI();
    }
    
    clearPlaylist() {
        if (!confirm('Are you sure you want to clear the entire playlist?')) {
            return;
        }
        
        // Revoke all URLs
        this.playlist.forEach(song => {
            URL.revokeObjectURL(song.url);
        });
        
        this.playlist = [];
        this.currentIndex = 0;
        this.audioPlayer.pause();
        this.audioPlayer.src = '';
        this.isPlaying = false;
        
        this.savePlaylistToStorage();
        this.updatePlaylistUI();
        this.hidePlaylist();
        this.showUploadSection();
    }
    
    savePlaylistToStorage() {
        try {
            // We can't store File objects, so we store metadata only
            const metadata = this.playlist.map(song => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                duration: song.duration,
                year: song.year,
                size: song.size,
                filename: song.file.name
            }));
            localStorage.setItem('pixeltunes_playlist_metadata', JSON.stringify(metadata));
        } catch (e) {
            console.error('Error saving playlist:', e);
        }
    }
    
    loadPlaylistFromStorage() {
        try {
            const metadata = localStorage.getItem('pixeltunes_playlist_metadata');
            if (metadata) {
                // We can show that songs were previously loaded but can't restore files
                // This is a limitation of web apps - files need to be re-uploaded
                console.log('Previous playlist found, but files need to be re-uploaded');
            }
        } catch (e) {
            console.error('Error loading playlist:', e);
        }
    }
    
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('pixeltunes_theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('pixeltunes_theme', 'dark');
        }
    }
    
    applyTheme() {
        const savedTheme = localStorage.getItem('pixeltunes_theme') || 'light';
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${savedTheme}-theme`);
        
        // Load saved settings
        const savedVolume = localStorage.getItem('pixeltunes_volume');
        if (savedVolume !== null) {
            this.updateVolume(parseInt(savedVolume));
        }
        
        const savedShuffle = localStorage.getItem('pixeltunes_shuffle');
        if (savedShuffle === 'true') {
            this.isShuffle = true;
            this.btnShuffle?.classList.add('active');
        }
        
        const savedRepeat = localStorage.getItem('pixeltunes_repeat');
        if (savedRepeat) {
            this.repeatMode = savedRepeat;
            this.btnRepeat?.classList.toggle('active', this.repeatMode !== 'off');
            this.btnRepeat?.classList.toggle('repeat-one', this.repeatMode === 'one');
        }
    }
    
    showLoading() {
        this.loadingIndicator.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
    }
    
    showError(message) {
        alert(message);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('service-worker.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PixelTunesPlayer();
});
