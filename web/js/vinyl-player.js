// PixelTunes Web - Vinyl Player Module

class VinylPlayer {
    constructor(audioPlayer, playlist, getCurrentIndex, onSeek, onPlayPause, onPrevious, onNext) {
        this.audioPlayer = audioPlayer;
        this.playlist = playlist;
        this.getCurrentIndex = getCurrentIndex;
        this.onSeek = onSeek;
        this.onPlayPause = onPlayPause;
        this.onPrevious = onPrevious;
        this.onNext = onNext;
        
        // State
        this.isUserRotating = false;
        this.isUserDraggingNeedle = false;
        this.lastAngle = 0;
        this.currentRotation = 0;
        this.needleOnVinyl = false;
        this.originalPlaybackRate = 1.0;
        
        // Elements
        this.vinylPlayerView = document.getElementById('vinylPlayerView');
        this.normalPlayerView = document.getElementById('normalPlayerView');
        this.vinylDisc = document.getElementById('vinylDisc');
        this.needleArm = document.getElementById('needleArm');
        this.vinylModeBtn = document.getElementById('vinylModeBtn');
        this.normalModeBtn = document.getElementById('normalModeBtn');
        
        // Vinyl controls
        this.vinylBtnPrevious = document.getElementById('vinylBtnPrevious');
        this.vinylBtnNext = document.getElementById('vinylBtnNext');
        this.vinylPlaylistBtn = document.getElementById('vinylPlaylistBtn');
        
        // Vinyl info displays
        this.vinylAlbumArt = document.getElementById('vinylAlbumArt');
        this.vinylCenterArt = document.getElementById('vinylCenterArt');
        this.vinylSongTitle = document.getElementById('vinylSongTitle');
        this.vinylArtistName = document.getElementById('vinylArtistName');
        this.vinylSeekBar = document.getElementById('vinylSeekBar');
        this.vinylCurrentTime = document.getElementById('vinylCurrentTime');
        this.vinylTotalTime = document.getElementById('vinylTotalTime');
        this.playlistPreview = document.getElementById('playlistPreview');
        
        this.init();
    }
    
    init() {
        // Load saved mode
        const savedMode = localStorage.getItem('pixeltunes_player_mode') || 'normal';
        if (savedMode === 'vinyl') {
            this.switchToVinylMode();
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mode switching
        this.vinylModeBtn?.addEventListener('click', () => this.switchToVinylMode());
        this.normalModeBtn?.addEventListener('click', () => this.switchToNormalMode());
        
        // Vinyl disc interactions
        this.vinylDisc?.addEventListener('click', (e) => {
            if (!this.isUserRotating && !this.isUserDraggingNeedle) {
                this.togglePlayPause();
            }
        });
        
        this.vinylDisc?.addEventListener('mousedown', (e) => this.startRotation(e));
        this.vinylDisc?.addEventListener('touchstart', (e) => this.startRotation(e));
        
        // Needle arm interactions
        this.needleArm?.addEventListener('mousedown', (e) => this.startNeedleDrag(e));
        this.needleArm?.addEventListener('touchstart', (e) => this.startNeedleDrag(e));
        
        // Vinyl controls
        this.vinylBtnPrevious?.addEventListener('click', () => this.onPrevious());
        this.vinylBtnNext?.addEventListener('click', () => this.onNext());
        this.vinylPlaylistBtn?.addEventListener('click', () => {
            // Trigger the main playlist button
            document.getElementById('playlistBtn')?.click();
        });
        
        // Vinyl seek bar
        let isVinylSeeking = false;
        this.vinylSeekBar?.addEventListener('input', () => {
            isVinylSeeking = true;
            const position = (this.audioPlayer.duration * this.vinylSeekBar.value) / 100;
            this.vinylCurrentTime.textContent = this.formatTime(position);
        });
        
        this.vinylSeekBar?.addEventListener('change', () => {
            isVinylSeeking = false;
            const position = (this.audioPlayer.duration * this.vinylSeekBar.value) / 100;
            this.onSeek(position);
        });
        
        // Update vinyl seek bar during playback
        this.audioPlayer.addEventListener('timeupdate', () => {
            if (!isVinylSeeking && this.audioPlayer.duration && this.vinylPlayerView.classList.contains('active')) {
                const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                this.vinylSeekBar.value = progress;
                this.vinylCurrentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
            }
        });
        
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            if (this.vinylPlayerView.classList.contains('active')) {
                this.vinylTotalTime.textContent = this.formatTime(this.audioPlayer.duration);
            }
        });
        
        // Listen for play/pause events to update needle and rotation
        this.audioPlayer.addEventListener('play', () => {
            if (this.vinylPlayerView.classList.contains('active')) {
                this.needleOnVinyl = true;
                this.updateNeedlePosition();
                this.startVinylRotation();
            }
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            if (this.vinylPlayerView.classList.contains('active')) {
                this.needleOnVinyl = false;
                this.updateNeedlePosition();
                this.stopVinylRotation();
            }
        });
    }
    
    startRotation(e) {
        if (this.playlist().length === 0) return;
        
        e.preventDefault();
        this.isUserRotating = true;
        this.stopVinylRotation();
        
        const rect = this.vinylDisc.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        this.lastAngle = this.getAngle(clientX, clientY, centerX, centerY);
        
        const onMove = (e) => this.handleRotation(e, centerX, centerY);
        const onEnd = () => this.endRotation(onMove, onEnd);
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    }
    
    handleRotation(e, centerX, centerY) {
        if (!this.isUserRotating) return;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const newAngle = this.getAngle(clientX, clientY, centerX, centerY);
        let deltaAngle = newAngle - this.lastAngle;
        
        // Handle wraparound
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        // 2° threshold to prevent accidental seeking
        if (Math.abs(deltaAngle) > 2) {
            // Seek through the song
            const seekDelta = (deltaAngle / 360) * this.audioPlayer.duration;
            const newTime = Math.max(0, Math.min(this.audioPlayer.duration, this.audioPlayer.currentTime + seekDelta));
            this.audioPlayer.currentTime = newTime;
            
            // Adjust pitch based on rotation speed
            const pitchMultiplier = 1.0 + (deltaAngle / 180); // -1 to +2 range
            const clampedPitch = Math.max(0.5, Math.min(1.5, pitchMultiplier));
            this.audioPlayer.playbackRate = clampedPitch;
            
            // Keep playing during rotation with pitch adjustment
            if (this.audioPlayer.paused) {
                this.audioPlayer.play();
            }
            
            // Rotate the disc visually
            this.currentRotation += deltaAngle;
            this.vinylDisc.style.transform = `rotate(${this.currentRotation}deg)`;
            
            this.lastAngle = newAngle;
        }
    }
    
    endRotation(onMove, onEnd) {
        this.isUserRotating = false;
        
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchend', onEnd);
        
        // Reset playback rate to normal
        this.audioPlayer.playbackRate = 1.0;
        
        // Resume normal rotation if playing
        if (!this.audioPlayer.paused) {
            this.startVinylRotation();
        }
    }
    
    startNeedleDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isUserDraggingNeedle = true;
        const startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const onMove = (e) => this.handleNeedleDrag(e, startY);
        const onEnd = () => this.endNeedleDrag(onMove, onEnd);
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    }
    
    handleNeedleDrag(e, startY) {
        if (!this.isUserDraggingNeedle) return;
        
        const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const deltaY = currentY - startY;
        
        // Determine if needle should be on or off vinyl based on drag direction
        if (deltaY > 20) {
            // Dragging down = needle on vinyl = play
            if (!this.needleOnVinyl) {
                this.needleOnVinyl = true;
                this.updateNeedlePosition();
                this.onPlayPause(true); // Play
            }
        } else if (deltaY < -20) {
            // Dragging up = needle off vinyl = pause
            if (this.needleOnVinyl) {
                this.needleOnVinyl = false;
                this.updateNeedlePosition();
                this.onPlayPause(false); // Pause
            }
        }
    }
    
    endNeedleDrag(onMove, onEnd) {
        this.isUserDraggingNeedle = false;
        
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchend', onEnd);
        
        // Snap to final position
        this.updateNeedlePosition();
    }
    
    togglePlayPause() {
        this.needleOnVinyl = !this.needleOnVinyl;
        this.updateNeedlePosition();
        this.onPlayPause();
    }
    
    updateNeedlePosition() {
        if (this.needleOnVinyl) {
            this.needleArm.classList.add('on-vinyl');
            this.needleArm.classList.remove('off-vinyl');
        } else {
            this.needleArm.classList.remove('on-vinyl');
            this.needleArm.classList.add('off-vinyl');
        }
    }
    
    startVinylRotation() {
        this.vinylDisc.classList.add('rotating');
    }
    
    stopVinylRotation() {
        this.vinylDisc.classList.remove('rotating');
    }
    
    getAngle(x, y, centerX, centerY) {
        const dx = x - centerX;
        const dy = y - centerY;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }
    
    switchToVinylMode() {
        this.normalPlayerView.style.display = 'none';
        this.vinylPlayerView.style.display = 'grid';
        this.vinylPlayerView.classList.add('active');
        localStorage.setItem('pixeltunes_player_mode', 'vinyl');
        
        // Sync current song info
        this.updateVinylDisplay();
        
        // Update needle position based on current playback state
        this.needleOnVinyl = !this.audioPlayer.paused;
        this.updateNeedlePosition();
        
        // Start rotation if playing
        if (!this.audioPlayer.paused) {
            this.startVinylRotation();
        }
    }
    
    switchToNormalMode() {
        this.vinylPlayerView.style.display = 'none';
        this.vinylPlayerView.classList.remove('active');
        this.normalPlayerView.style.display = 'flex';
        localStorage.setItem('pixeltunes_player_mode', 'normal');
        
        // Stop vinyl rotation
        this.stopVinylRotation();
    }
    
    updateVinylDisplay() {
        const currentIndex = this.getCurrentIndex();
        const currentSong = this.playlist()[currentIndex];
        
        if (currentSong) {
            // Update album art
            const normalAlbumArt = document.getElementById('albumArt');
            if (normalAlbumArt) {
                this.vinylAlbumArt.src = normalAlbumArt.src;
                this.vinylCenterArt.src = normalAlbumArt.src;
            }
            
            // Update song info
            this.vinylSongTitle.textContent = currentSong.title;
            this.vinylArtistName.textContent = currentSong.artist;
            
            // Update time displays
            if (this.audioPlayer.duration) {
                this.vinylTotalTime.textContent = this.formatTime(this.audioPlayer.duration);
            }
        }
        
        // Update playlist preview
        this.updatePlaylistPreview();
    }
    
    updatePlaylistPreview() {
        const currentIndex = this.getCurrentIndex();
        const songs = this.playlist();
        
        this.playlistPreview.innerHTML = '';
        
        // Show next 3 songs
        for (let i = 1; i <= 3; i++) {
            const nextIndex = (currentIndex + i) % songs.length;
            if (nextIndex === currentIndex) break; // Don't show same song
            
            const song = songs[nextIndex];
            if (!song) break;
            
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <div class="preview-item-title">${this.escapeHtml(song.title)}</div>
                <div class="preview-item-artist">${this.escapeHtml(song.artist)}</div>
            `;
            
            item.addEventListener('click', () => {
                // Load and play this song
                this.onSeek(0); // Reset to beginning
                // Note: The main app needs to handle loading specific songs
                // For now, this just shows what's coming up
            });
            
            this.playlistPreview.appendChild(item);
        }
        
        if (this.playlistPreview.children.length === 0) {
            this.playlistPreview.innerHTML = '<p style="text-align: center; opacity: 0.6;">No upcoming songs</p>';
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Called when song changes
    onSongChange() {
        if (this.vinylPlayerView.classList.contains('active')) {
            this.updateVinylDisplay();
        }
    }
}
