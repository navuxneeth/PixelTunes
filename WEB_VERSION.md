# PixelTunes Web Version

🎵 **A fully-featured web version of PixelTunes that runs on PC and works offline!**

## 📍 Location

The web version is located in the `web/` directory of this repository.

## ✨ Features

### Core Functionality
- ✅ **Upload audio files** - Individual files or entire folders
- ✅ **Drag and drop** support for easy file management
- ✅ **Full playback controls** - Play, pause, previous, next
- ✅ **Seek functionality** - Jump to any position in a song
- ✅ **Playlist management** - View, organize, and remove songs
- ✅ **Offline support** - Works without internet after first load
- ✅ **Responsive design** - Optimized for desktop, tablet, and mobile

### Supported Audio Formats
- MP3, FLAC, WAV, OGG, M4A, AAC

### User Interface
- 🎨 **Retro pixel aesthetic** matching the Android app
- 🌓 **Light and Dark themes** with persistence
- 📱 **Fully responsive** - works on all screen sizes
- ⌨️ **Keyboard shortcuts** for quick control

## 🚀 Quick Start

### Option 1: Open Directly (Simple)
1. Navigate to the `web/` directory
2. Open `index.html` in a modern web browser
3. Upload your music files and start playing!

### Option 2: Use a Local Web Server (Recommended)

For full features including Service Worker support, use a local web server:

#### Python 3
```bash
cd web
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

#### Node.js
```bash
npm install -g http-server
cd web
http-server -p 8000
```
Then open http://localhost:8000 in your browser.

## 📸 Screenshots

### Light Theme - Upload Screen
![Light Theme Upload](https://github.com/user-attachments/assets/6518bae9-9e0a-40d7-9372-a42d47d4ea12)

### Dark Theme - Upload Screen
![Dark Theme Upload](https://github.com/user-attachments/assets/128479d5-13b9-4601-8f90-23b8b84fb8c2)

### Mobile Responsive Design
![Mobile View](https://github.com/user-attachments/assets/929da050-0409-4ef1-82eb-e86387088f21)

## 🎮 Usage

### Uploading Music
1. **Click "Upload Files"** to select individual audio files
2. **Click "Upload Folder"** to upload an entire music folder
3. **Drag and drop** files or folders directly onto the upload area

### Playing Music
1. After uploading, the player interface will appear
2. Click **Play** to start playback
3. Use **Previous/Next** to navigate between songs
4. Click **PLAYLIST** to view all songs
5. Click any song in the playlist to play it

### Keyboard Shortcuts
- **Space**: Play/Pause
- **Left Arrow**: Seek backward 5 seconds
- **Right Arrow**: Seek forward 5 seconds

## 🌐 Browser Requirements

### Recommended Browsers
- Chrome/Chromium 90+
- Firefox 88+
- Edge 90+
- Safari 14+
- Opera 76+

### Required Features
- HTML5 Audio API
- File API
- LocalStorage
- Service Worker (for offline support)
- CSS Grid and Flexbox

## 💡 Key Differences from Android App

### Advantages
✅ No installation required
✅ Works on any PC with a browser
✅ Platform-independent (Windows, Mac, Linux)
✅ Easy to share with others

### Limitations
⚠️ Audio files must be re-uploaded after closing the browser (browser security)
⚠️ No automatic media library scanning
⚠️ Album art shows default pixel art (no metadata extraction yet)

## 🔧 Technical Details

### Built With
- **HTML5** - Semantic markup and Audio API
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No frameworks, lightweight
- **Service Worker** - Offline functionality
- **LocalStorage** - Settings persistence

### File Structure
```
web/
├── index.html           # Main HTML file
├── manifest.json        # PWA manifest
├── service-worker.js    # Offline support
├── css/
│   └── styles.css      # All styles and themes
├── js/
│   └── app.js          # Main application logic
└── README.md           # Detailed documentation
```

### Performance
- **Total size**: ~30KB (uncompressed)
- **No external dependencies** (except Google Fonts)
- **Fast loading** and responsive UI
- **Memory efficient** with automatic cleanup

## 📖 Full Documentation

For complete documentation, see [web/README.md](web/README.md) which includes:
- Detailed feature descriptions
- Troubleshooting guide
- Tips and best practices
- Known limitations
- Future enhancements

## 🎯 Use Cases

### Perfect For
- 🎧 **PC music listening** without installing software
- 💼 **Office environments** where you can't install apps
- 🌐 **Cross-platform needs** - works on any OS
- 🎨 **Retro aesthetic lovers** who want desktop experience
- 📚 **Quick music playback** without library management

### Not Ideal For
- Long-term music library management (use Android app)
- Very large music collections (memory intensive)
- Environments without modern browsers

## 🆘 Support

If you encounter issues:
1. Check [web/README.md](web/README.md) for troubleshooting
2. Ensure you're using a modern browser
3. Try using a local web server instead of file:// URLs
4. Check browser console for error messages
5. Open an issue on GitHub

## 🚀 Future Enhancements

Planned features:
- 🎲 Shuffle and repeat modes
- 🎨 Album art extraction from file metadata
- 📊 Audio visualizer
- 🔊 Volume control
- 💾 IndexedDB for persistent storage
- 🔍 Search functionality
- 🎵 Playlist import/export

## 📄 License

Part of the PixelTunes project. Same license as the main repository.

## 🎉 Get Started Now!

1. `cd web`
2. `python3 -m http.server 8000`
3. Open http://localhost:8000
4. Upload your music and enjoy!

---

**Made with ❤️ for music lovers who appreciate the retro aesthetic**
