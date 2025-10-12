// PixelTunes - Lossless Audio Player
class PixelTunes {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        
        this.initElements();
        this.initEventListeners();
        this.initVisualizer();
    }

    initElements() {
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.selectBtn = document.getElementById('selectBtn');
        this.nowPlaying = document.getElementById('nowPlaying');
        this.playlistDiv = document.getElementById('playlist');
        this.playlistItems = document.getElementById('playlistItems');
        
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        
        this.volumeSlider = document.getElementById('volumeSlider');
        this.muteBtn = document.getElementById('muteBtn');
        
        this.fileCount = document.getElementById('fileCount');
    }

    initEventListeners() {
        // File selection
        this.selectBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        
        // Drag and drop
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });
        
        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('dragover');
        });
        
        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // Playback controls
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Progress bar
        this.progressBar.addEventListener('input', (e) => {
            const time = (e.target.value / 100) * this.audioPlayer.duration;
            this.audioPlayer.currentTime = time;
        });
        
        // Volume control
        this.volumeSlider.addEventListener('input', (e) => {
            this.audioPlayer.volume = e.target.value / 100;
            this.updateVolumeIcon();
        });
        
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Audio player events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.nextTrack());
        
        // Set initial volume
        this.audioPlayer.volume = 0.7;
    }

    initVisualizer() {
        this.canvas = document.getElementById('visualizerCanvas');
        this.canvasCtx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Create audio context for visualization
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            this.source = this.audioContext.createMediaElementSource(this.audioPlayer);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.drawVisualizer();
        } catch (error) {
            console.log('Web Audio API not supported:', error);
        }
    }

    drawVisualizer() {
        requestAnimationFrame(() => this.drawVisualizer());
        
        if (!this.analyser) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        this.canvasCtx.fillStyle = 'rgba(15, 15, 30, 0.3)';
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = (this.dataArray[i] / 255) * this.canvas.height;
            
            // Pixel-style bars
            const gradient = this.canvasCtx.createLinearGradient(0, this.canvas.height - barHeight, 0, this.canvas.height);
            gradient.addColorStop(0, '#00ff9f');
            gradient.addColorStop(0.5, '#ffd700');
            gradient.addColorStop(1, '#ff6b9d');
            
            this.canvasCtx.fillStyle = gradient;
            this.canvasCtx.fillRect(x, this.canvas.height - barHeight, barWidth - 2, barHeight);
            
            x += barWidth;
        }
    }

    handleFiles(files) {
        const audioFiles = Array.from(files).filter(file => 
            file.type.startsWith('audio/')
        );
        
        if (audioFiles.length === 0) {
            alert('Please select valid audio files!');
            return;
        }
        
        this.playlist = audioFiles.map((file, index) => ({
            file: file,
            url: URL.createObjectURL(file),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist',
            index: index
        }));
        
        this.updatePlaylist();
        this.loadTrack(0);
        this.showPlayer();
    }

    updatePlaylist() {
        this.playlistItems.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.textContent = `${index + 1}. ${track.title}`;
            li.addEventListener('click', () => this.loadTrack(index));
            this.playlistItems.appendChild(li);
        });
        
        this.fileCount.textContent = `${this.playlist.length} tracks loaded`;
    }

    showPlayer() {
        this.uploadZone.style.display = 'none';
        this.nowPlaying.style.display = 'block';
        this.playlistDiv.style.display = 'block';
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        this.audioPlayer.src = track.url;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // Update playlist active state
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audioPlayer.play();
        this.isPlaying = true;
        this.playBtn.textContent = '⏸️';
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playBtn.textContent = '▶️';
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    previousTrack() {
        const prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    updateProgress() {
        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressBar.value = progress;
        this.progressFill.style.width = progress + '%';
        this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audioPlayer.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    toggleMute() {
        this.audioPlayer.muted = !this.audioPlayer.muted;
        this.updateVolumeIcon();
    }

    updateVolumeIcon() {
        if (this.audioPlayer.muted || this.audioPlayer.volume === 0) {
            this.muteBtn.textContent = '🔇';
        } else if (this.audioPlayer.volume < 0.5) {
            this.muteBtn.textContent = '🔉';
        } else {
            this.muteBtn.textContent = '🔊';
        }
    }
}

// Initialize the player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PixelTunes();
    console.log('🎮 PixelTunes initialized! Ready to play some tunes! 🎵');
});
