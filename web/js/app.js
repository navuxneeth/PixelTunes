// PixelTunes Web - Main Application JavaScript

class PixelTunesPlayer {
    constructor() {
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.audioPlayer = document.getElementById('audioPlayer');
        this.isUserSeeking = false;
        
        this.initializeElements();
        this.loadPlaylistFromStorage();
        this.setupEventListeners();
        this.setupAudioEventListeners();
        this.setupDragAndDrop();
        this.applyTheme();
        
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
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        
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
        
        // Theme
        this.themeToggle = document.getElementById('themeToggle');
    }
    
    setupEventListeners() {
        // Playback controls
        this.btnPlayPause.addEventListener('click', () => this.togglePlayPause());
        this.btnPrevious.addEventListener('click', () => this.playPrevious());
        this.btnNext.addEventListener('click', () => this.playNext());
        
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
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.code === 'ArrowLeft') {
                this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 5);
            } else if (e.code === 'ArrowRight') {
                this.audioPlayer.currentTime = Math.min(this.audioPlayer.duration, this.audioPlayer.currentTime + 5);
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
        
        const newIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.audioPlayer.play();
        }
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
