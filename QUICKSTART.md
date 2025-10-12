# PixelTunes Quick Start Guide

Get PixelTunes up and running in minutes!

## ⚡ Fast Track

### For Android Studio Users

1. **Clone & Open**
   ```bash
   git clone https://github.com/navuxneeth/PixelTunes.git
   cd PixelTunes
   ```
   Open the folder in Android Studio

2. **Wait for Sync**
   Gradle will automatically sync (1-2 minutes)

3. **Connect Device**
   - Physical device with USB debugging enabled, OR
   - Start an Android emulator (API 31+)

4. **Run**
   Press the green **Run** button (▶️) or `Shift+F10`

That's it! The app will build and launch.

### For Command Line Users

```bash
# Clone the repository
git clone https://github.com/navuxneeth/PixelTunes.git
cd PixelTunes

# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug

# Or manually install
adb install app/build/outputs/apk/debug/app-debug.apk
```

## 📱 First Launch

### Step 1: Grant Permission
When you first open PixelTunes:
- Tap **"Grant Permission"**
- Select **"Allow"** when Android asks for media access

### Step 2: Wait for Scan
- PixelTunes will scan your device for music
- This takes a few seconds to a minute
- Songs will appear automatically

### Step 3: Play Music!
- Tap **"PLAYLIST"** to see your songs
- Tap any song to start playing
- Use the controls to navigate

## 🎮 Basic Controls

### Main Screen
- **⏯️ Play/Pause** - Large center button
- **⏮️ Previous** - Left button
- **⏭️ Next** - Right button
- **Progress Bar** - Drag to seek
- **⚙️ Settings** - Top-right gear icon
- **📋 Playlist** - Bottom button

### Playlist Screen
- **Tap a song** - Start playing immediately
- **← Back** - Return to player

### Settings Screen
- **Theme Selection** - Choose Light/Dark/System
- **← Back** - Save and return

## 🎨 Theme Selection

### Change Theme
1. Tap **Settings** (⚙️) on main screen
2. Select your preferred theme:
   - **Light Mode** - Mint green background
   - **Dark Mode** - Deep teal background  
   - **System Default** - Follows your device
3. Theme changes immediately!

## 📚 Adding Music

PixelTunes reads music from your device storage:

### Where to Put Music Files
1. Connect phone to computer via USB
2. Copy music files to:
   - `Music/` folder
   - `Download/` folder
   - Any folder Android can access

### Supported Formats
- MP3, FLAC, AAC, WAV, OGG, M4A
- Lossless formats (FLAC) play at full quality

### Refresh Library
- Close and reopen PixelTunes
- New songs will appear automatically

## 🔧 Common Issues

### "No songs found"
- **Solution**: Check if you have audio files in `Music/` folder
- Ensure media permission is granted
- Try closing and reopening the app

### "Permission required"
- **Solution**: Tap "Grant Permission"
- In Android settings: Apps → PixelTunes → Permissions → Allow

### Album art not showing
- **Solution**: Album art comes from file metadata
- Use a music tagger to add album art to files
- Default pixel art will show if none exists

### Can't hear audio
- **Solution**: Check device volume
- Ensure media volume is not muted
- Try unplugging/replugging headphones

## 💡 Pro Tips

### Playback Quality
- Use FLAC files for best quality
- PixelTunes supports bit-perfect playback
- No quality loss in processing

### Battery Saving
- Use Dark Mode to save battery on OLED screens
- Music plays efficiently in background
- Minimal battery drain

### Organization
- Name your files properly for best display
- Add metadata (artist, album, track number)
- Use consistent folder structure

### Quick Navigation
- Double-tap next/previous for quick skipping
- Drag progress bar for precise seeking
- Use system notification controls

## 🎯 Feature Checklist

After installation, try these features:

- [ ] Grant media permission
- [ ] View your music library in playlist
- [ ] Play a song
- [ ] Use play/pause control
- [ ] Skip to next song
- [ ] Skip to previous song
- [ ] Seek to different position
- [ ] Switch to dark mode
- [ ] Switch to light mode
- [ ] Play in background
- [ ] Control from notifications
- [ ] Lock screen controls

## 📖 Learn More

- **Full Features**: See [FEATURES.md](FEATURES.md)
- **Building Guide**: See [BUILDING.md](BUILDING.md)
- **Screenshots**: See [SCREENSHOTS.md](SCREENSHOTS.md)
- **Main README**: See [README.md](README.md)

## 🆘 Getting Help

### Check Documentation
1. Read [FEATURES.md](FEATURES.md) for complete feature list
2. Check [BUILDING.md](BUILDING.md) for build issues
3. Review [README.md](README.md) for overview

### Troubleshooting Steps
1. Restart the app
2. Clear app data (Settings → Apps → PixelTunes → Storage → Clear Data)
3. Reinstall the app
4. Check Android version (needs 12+)
5. Verify audio files are not corrupted

## 🎉 Enjoy Your Music!

PixelTunes is now ready to play your music in retro style!

**Features at a glance:**
- 🎵 High-quality audio playback
- 🎨 Beautiful retro interface
- 🌓 Light and dark themes
- 📱 Simple, intuitive controls
- 🔒 Privacy-focused permissions
- ⚡ Fast and efficient

Happy listening! 🎧
