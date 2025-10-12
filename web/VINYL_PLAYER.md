# Vintage Vinyl Player Mode - Web Version

## Overview

The Vintage Vinyl Player Mode transforms the PixelTunes web player into a complete pixel-art styled vinyl record player interface, bringing the retro aesthetic to life with interactive features that simulate a real turntable.

## Features

### Visual Design

- **Black Vinyl Disc**: Authentic-looking vinyl record with concentric groove circles
- **Center Album Art**: Album cover displayed in a circular card at the disc center
- **Pixel-Art Needle Arm**: Wooden tonearm with realistic appearance
- **8-Bit Aesthetic**: Consistent retro styling using VT323 pixel font
- **Responsive Layout**: Works on desktop, tablet, and mobile devices

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Left Panel (45%)                        │
│  ┌──────────────┐                                          │
│  │  Album Art   │                                          │
│  └──────────────┘                                          │
│                                                             │
│  Song Title                                                │
│  Artist Name                                               │
│                                                             │
│  [Progress Bar]                                            │
│  0:00                                        3:45          │
│                                                             │
│  UP NEXT                                                   │
│  • Next Song 1                                             │
│  • Next Song 2                                             │
│  • Next Song 3                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Right Panel (55%)                        │
│                                                             │
│              ╭─────────────╮                               │
│            ╱                 ╲                             │
│          │   ⚫    Vinyl    ⚫   │                          │
│          │     ┌─────┐       │                            │
│          │     │Album│       │         ╱                  │
│           ╲    └─────┘     ╱        ╱  Needle             │
│             ╲           ╱         ╱                        │
│               ─────────                                    │
│                                                             │
│         [◄◄ Previous]    [Next ►►]                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Made by Navaneeth Sankar K P                   │
│          [LinkedIn]  [@navuxneeth/PixelTunes]              │
│                                                             │
│       [PLAYLIST]        [NORMAL PLAYER]                    │
└─────────────────────────────────────────────────────────────┘
```

## Interactive Features

### 1. Tap to Play/Pause

**Action**: Single tap/click anywhere on the vinyl disc

**Effect**: 
- Toggles playback state
- Needle arm smoothly animates on/off the disc (0° to 25° rotation over 300ms)
- Vinyl rotation starts/stops

**Visual Feedback**:
- Needle moves to "on vinyl" position when playing
- Vinyl disc rotates continuously when playing
- Needle returns to "off vinyl" position when paused

### 2. Draggable Needle Arm

**Action**: Click and drag the needle arm

**Controls**:
- **Drag Down**: Places needle on vinyl → starts playback
- **Drag Up**: Lifts needle off vinyl → pauses playback

**Behavior**:
- Snaps to final position when released
- Synchronized with play/pause button
- Provides tactile control like a real turntable

### 3. Manual Seeking (Vinyl Rotation)

**Action**: Click and rotate the vinyl disc by dragging

**Effect**:
- Seeks through the song based on rotation angle
- 2° threshold prevents accidental seeking
- Audio continues playing during rotation

**Pitch Adjustment**:
- Rotating clockwise: Pitch increases (up to 1.5x speed)
- Rotating counter-clockwise: Pitch decreases (down to 0.5x speed)
- Audio distortion simulates real turntable scratching
- Returns to normal pitch (1.0x) when rotation stops

### 4. Automatic Rotation

**Behavior**: When music plays, the vinyl disc rotates continuously

**Speed**: 3 seconds per revolution (20 RPM)

**Purpose**: Provides visible feedback that music is playing

### 5. Playlist Preview

**Display**: Shows next 3 upcoming songs in the "Up Next" section

**Updates**: Automatically refreshes when current song changes

**Interaction**: Click preview items to see what's coming up

### 6. Mode Switching

**Toggle Button**: "VINYL PLAYER" / "NORMAL PLAYER" button

**Modes**:
- **Normal Mode**: Traditional player with centered layout
- **Vinyl Mode**: Split-screen vinyl player interface

**Persistence**: Selected mode is saved to localStorage and restored on next visit

## Usage Instructions

### Getting Started

1. Upload your music files using the "Upload Files" or "Upload Folder" buttons
2. Once songs are loaded, click "VINYL PLAYER" button to switch to vinyl mode
3. The vinyl player interface will appear with your current song

### Playing Music

**Method 1: Tap the Vinyl Disc**
- Click anywhere on the black vinyl disc to start playing
- Click again to pause

**Method 2: Use the Needle Arm**
- Click and drag the needle arm down (towards the vinyl) to play
- Drag it up (away from the vinyl) to pause

**Method 3: Use Progress Bar**
- Use the seek bar below the album art to jump to any position

### Seeking Through Songs

**Rotate the Vinyl**:
1. Click on the vinyl disc and hold
2. Move your mouse in a circular motion to rotate the disc
3. The song will seek forward/backward based on rotation
4. Audio pitch will adjust during rotation for realistic effect
5. Release to return to normal playback

### Navigation

- **Previous Button** (◄◄): Go to previous song or restart current song
- **Next Button** (►►): Skip to next song in playlist
- **Playlist Preview**: Click "UP NEXT" items to see upcoming songs

### Switching Back to Normal Mode

Click the "NORMAL PLAYER" button at the bottom to return to the traditional player interface

## Technical Details

### Files

- **vinyl-player.js**: Core vinyl player functionality
  - Rotation detection and seeking
  - Needle arm drag handling
  - Pitch adjustment during manual rotation
  - Mode persistence

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: Touch events supported on iOS and Android
- **Requirements**: JavaScript enabled, Web Audio API support

### Performance

- Smooth 60 FPS animations using CSS transforms
- Efficient event handling with throttling
- Minimal DOM manipulation for optimal performance

### Responsive Design

- **Desktop (1024px+)**: Side-by-side layout (45%/55%)
- **Tablet (768px-1024px)**: Stacked layout with full width
- **Mobile (< 768px)**: Optimized for touch with smaller controls

## Keyboard Shortcuts

When in vinyl mode, standard playback shortcuts still work:

- **Space**: Toggle play/pause
- **Left Arrow**: Seek backward 5 seconds
- **Right Arrow**: Seek forward 5 seconds

## Attribution

The vinyl player displays attribution footer with:

- **Creator**: "Made by Navaneeth Sankar K P"
- **LinkedIn**: Direct link to profile
- **GitHub**: Link to @navuxneeth/PixelTunes repository

## Tips for Best Experience

1. **Use Quality Audio**: The vinyl player works best with high-quality audio files
2. **Adjust Volume**: Set appropriate volume before rotating vinyl (pitch changes can be loud)
3. **Explore Interactions**: Try all three play methods to find your favorite
4. **Mobile Users**: Use touch gestures to rotate vinyl and drag needle
5. **Dark Mode**: Toggle theme for different visual experiences

## Known Limitations

1. **Browser Security**: Audio files must be re-uploaded after browser closes
2. **Pitch Range**: Limited to 0.5x - 1.5x to maintain audio quality
3. **Rotation Sensitivity**: 2° threshold means very small movements are ignored

## Future Enhancements

Planned improvements:

- [ ] Add scratch sound effects during manual rotation
- [ ] Visual EQ display on vinyl grooves
- [ ] Multiple vinyl designs/colors
- [ ] Animated dust particles for extra realism
- [ ] Album art extraction from file metadata
- [ ] Customizable rotation speeds

## Troubleshooting

**Vinyl won't rotate**:
- Ensure audio is playing (check browser console for errors)
- Try clicking the disc to start playback

**Needle doesn't respond**:
- Click and hold, then drag vertically
- Check that JavaScript is enabled

**Pitch adjustment not working**:
- Verify Web Audio API support in your browser
- Some browsers require user interaction before audio manipulation

**Mode doesn't persist**:
- Check that localStorage is enabled
- Clear browser cache and try again

## Credits

Inspired by the Android app's Vintage Vinyl Player Mode. Adapted for web with enhanced interactivity and responsive design.
