# PixelTunes Web App 🌐

A browser-based lossless audio player with a retro pixel-themed design.

## Features

- **Lossless Audio Support**: Play FLAC, WAV, ALAC, MP3, OGG formats
- **Drag & Drop**: Easy file loading by dragging files into the browser
- **Audio Visualizer**: Real-time frequency visualization with pixel aesthetics
- **Playlist Management**: Queue multiple tracks and navigate between them
- **Responsive Design**: Works on desktop and mobile browsers
- **No Installation Required**: Just open and play!

## How to Use

1. Open `index.html` in any modern web browser
2. Click "SELECT FILES" or drag audio files into the upload zone
3. Use the playback controls to play, pause, skip tracks
4. Adjust volume using the volume slider

## Supported Browsers

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Technical Details

- Pure JavaScript (no framework dependencies)
- Web Audio API for visualization
- HTML5 Audio for playback
- CSS3 with pixel-perfect styling
- Responsive design with mobile support

## Customization

### Colors
Edit `style.css` to customize the color scheme:
```css
:root {
    --pixel-bg: #0f0f1e;
    --pixel-primary: #00ff9f;
    --pixel-secondary: #ff6b9d;
    --pixel-accent: #ffd700;
}
```

### Fonts
The app uses "Press Start 2P" font for authentic retro feel. You can change it in the CSS file.

## Local Development

Simply open `index.html` in a browser. For development with live reload, you can use any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Browser Compatibility Notes

- Web Audio API requires user interaction before starting (click to play)
- Some browsers may limit file access for security reasons
- Large playlists may consume memory; close browser tab when done

## Privacy

All audio processing happens locally in your browser. No files are uploaded to any server.

## Credits

- Font: Press Start 2P by Google Fonts
- Icons: Unicode emoji characters
- Design: Inspired by 8-bit era gaming aesthetics
