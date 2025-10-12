# PixelTunes Web

A retro-style music player web application that runs on PC and works offline.

![PixelTunes Web](https://img.shields.io/badge/PixelTunes-Web-brightgreen)
![Offline Support](https://img.shields.io/badge/Offline-Supported-blue)
![Responsive](https://img.shields.io/badge/Design-Responsive-orange)

## ✨ Features

### 🎵 Audio Playback
- **High-quality audio playback** using HTML5 Audio API
- **Supported formats**: MP3, FLAC, WAV, OGG, M4A, AAC
- Gapless playback between tracks
- Full playback controls (play, pause, previous, next)
- Seek bar with time display
- Keyboard shortcuts support

### 🎛️ Vintage Vinyl Player Mode (NEW!)
- **Interactive vinyl disc** with realistic rotation (20 RPM when playing)
- **Draggable needle arm** - drag up to pause, down to play
- **Manual seeking** by rotating the vinyl disc
- **Real-time pitch adjustment** during manual rotation (0.5x - 1.5x speed)
- **Tap to play/pause** anywhere on the vinyl disc
- **Split-screen layout**: Album art and playlist preview on left, vinyl player on right
- **Mode persistence**: Automatically remembers your preferred mode
- **Attribution footer**: Links to LinkedIn and GitHub profiles
- 📖 [Full Vinyl Player Documentation](VINYL_PLAYER.md)

### 📁 File Management
- **Upload audio files** individually or in batches
- **Upload entire folders** with music collections
- **Drag and drop** files directly into the player
- Automatic metadata extraction
- Playlist management with delete functionality

### 🎨 User Interface
- **Retro pixel aesthetic** matching the Android app
- **Responsive design** - works on desktop, tablet, and mobile
- **Two themes**: Light and Dark mode
- Theme persistence across sessions
- Album art display (with default pixel art)
- Clean, intuitive controls

### 💾 Offline Support
- **Works completely offline** after first load
- Service Worker caching for app resources
- No internet connection required after installation
- Audio files stored in browser memory during session

### ⌨️ Keyboard Shortcuts
- **Space**: Play/Pause
- **Left Arrow**: Seek backward 5 seconds
- **Right Arrow**: Seek forward 5 seconds

## 🚀 Getting Started

### Quick Start

1. **Open the web player**:
   - Simply open `index.html` in a modern web browser
   - Or serve it using a local web server

2. **Upload your music**:
   - Click "Upload Files" to select individual audio files
   - Click "Upload Folder" to select an entire music folder
   - Or drag and drop files directly onto the upload area

3. **Start playing**:
   - Click on any song in the playlist to play it
   - Use the playback controls to navigate
   - Toggle between light and dark themes

### Using a Local Web Server

For the best experience (especially for service worker support), serve the app using a local web server:

#### Option 1: Python 3
```bash
cd web
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

#### Option 2: Node.js (http-server)
```bash
npm install -g http-server
cd web
http-server -p 8000
```
Then open http://localhost:8000 in your browser.

#### Option 3: VS Code Live Server
- Install the "Live Server" extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"

## 📱 Responsive Design

PixelTunes Web is fully responsive and works on:
- **Desktop computers** (1024px and above)
- **Tablets** (768px - 1024px)
- **Mobile phones** (320px - 768px)

The layout automatically adapts to your screen size.

## 🎨 Themes

### Light Theme
- Background: Soft mint green (#D3E4DC)
- Primary color: Deep teal (#2A5E75)
- Perfect for daytime use

### Dark Theme
- Background: Deep teal (#2A5E75)
- Primary color: Soft mint green (#D3E4DC)
- Easier on the eyes in low light

Toggle between themes using the sun/moon icon in the top-right corner.

## 🔧 Browser Compatibility

### Recommended Browsers
- ✅ **Chrome/Chromium** 90+ (Best support)
- ✅ **Firefox** 88+
- ✅ **Edge** 90+
- ✅ **Safari** 14+
- ✅ **Opera** 76+

### Required Features
- HTML5 Audio API
- File API with FileReader
- LocalStorage
- Service Worker (for offline support)
- CSS Grid and Flexbox

## 📊 Supported Audio Formats

| Format | Extension | Quality | Notes |
|--------|-----------|---------|-------|
| MP3    | .mp3      | Lossy   | Universal compatibility |
| FLAC   | .flac     | Lossless| Best quality |
| WAV    | .wav      | Lossless| Uncompressed |
| OGG    | .ogg      | Lossy   | Open source |
| M4A    | .m4a      | Lossy   | Apple format |
| AAC    | .aac      | Lossy   | High quality |

## 🎯 Key Features Explained

### Offline Operation
Once you load the app for the first time, it caches all necessary resources using a Service Worker. This means you can:
- Close your browser and reopen the app without internet
- Play music without any network connection
- Use it like a native desktop application

**Note**: Audio files are stored in browser memory during the session. You'll need to re-upload them if you close the browser and restart.

### Playlist Management
- Songs are displayed in the order they were uploaded
- Click any song in the playlist to play it
- Remove individual songs using the delete button
- Clear the entire playlist with one click
- Current playing song is highlighted

### File Upload Methods
1. **Click to Browse**: Traditional file picker
2. **Drag and Drop**: Drag files from your file manager
3. **Folder Upload**: Upload entire music folders at once

### Privacy & Security
- All processing happens locally in your browser
- No data is sent to any server
- Audio files never leave your computer
- No tracking or analytics

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and Audio API
- **CSS3**: Modern styling with CSS variables
- **Vanilla JavaScript**: No frameworks required
- **Service Worker**: Offline functionality
- **LocalStorage**: Settings persistence

### File Structure
```
web/
├── index.html           # Main HTML file
├── css/
│   └── styles.css      # All styles and themes
├── js/
│   ├── app.js          # Main application logic
│   └── vinyl-player.js # Vinyl player module
├── service-worker.js   # Offline support
├── README.md           # This file
└── VINYL_PLAYER.md     # Vinyl player documentation
```

### Performance
- **Small footprint**: ~30KB total (uncompressed)
- **Fast loading**: Minimal dependencies
- **Efficient playback**: Native browser audio
- **Memory conscious**: Cleans up unused resources

## 🔍 Troubleshooting

### Audio files not playing
- **Check format**: Ensure the file is in a supported format
- **Check browser**: Make sure your browser supports the audio codec
- **Check file**: The file might be corrupted

### Upload not working
- **Browser support**: Ensure your browser supports File API
- **File size**: Very large files might take time to process
- **Permissions**: Allow file access when prompted

### Service Worker not working
- **HTTPS required**: Service Workers require HTTPS (except on localhost)
- **Browser support**: Check if your browser supports Service Workers
- **Clear cache**: Try clearing browser cache and reloading

### Theme not persisting
- **LocalStorage**: Ensure LocalStorage is enabled in your browser
- **Private browsing**: Themes won't persist in private/incognito mode

## 💡 Tips & Best practices

### For Best Quality
- Use FLAC files for lossless playback
- Ensure files have proper metadata (title, artist, album)
- Keep file names descriptive

### For Best Performance
- Don't upload too many files at once (split into batches)
- Close the playlist modal when not needed
- Use browser zoom for accessibility

### For Organization
- Organize files in folders before uploading
- Use consistent naming conventions
- Add album art to your files (future feature)

## 🚧 Known Limitations

1. **Playlist persistence**: Audio files must be re-uploaded after closing the browser (browser security restriction)
2. **Album art**: Currently shows default pixel art (metadata extraction planned)
3. **No shuffle/repeat**: Not yet implemented (planned feature)
4. **No equalizer**: Uses default browser audio output
5. **File size**: Very large files (>100MB) may cause performance issues

## 🔮 Future Enhancements

Potential features for future versions:
- 🎲 Shuffle and repeat modes
- 🎨 Album art extraction from files
- 📊 Audio visualizer
- 🔊 Volume control
- 🎚️ Equalizer
- 💾 IndexedDB for persistent file storage
- 🔍 Search functionality
- 📱 Better mobile gestures
- 🎵 Playlist export/import
- ⏱️ Sleep timer

## 📄 License

This web version is part of the PixelTunes project.

## 🤝 Contributing

Feel free to contribute improvements:
1. Fork the repository
2. Make your changes
3. Test thoroughly across browsers
4. Submit a pull request

## 🆘 Getting Help

If you encounter issues:
1. Check this README for solutions
2. Check browser console for errors
3. Try a different browser
4. Clear cache and try again
5. Open an issue on GitHub

## 🎉 Enjoy Your Music!

PixelTunes Web brings the retro music experience to your browser. Upload your favorite tracks and enjoy high-quality playback with a nostalgic pixel aesthetic!

---

**Made with ❤️ for music lovers who appreciate the retro aesthetic**
