# Vinyl Player Layout Structure

## Screen Layout (Landscape-optimized)

```
┌─────────────────────────────────────────────────────────────────┐
│                         PixelTunes                         [⚙]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌─────────────────────────┐     │
│  │                  │         │                         │     │
│  │   Album Cover    │         │      ╭─────────╮       │     │
│  │                  │         │    ╱             ╲     │     │
│  │                  │         │   │  ⚫  Vinyl   ⚫  │   │     │
│  └──────────────────┘         │   │   ┌─────┐     │   │     │
│                                │   │   │Album│     │   │     │
│  Song Title                    │    ╲  └─────┘   ╱    │     │
│  Artist Name                   │      ╲         ╱      │     │
│                                │        ─────────       │     │
│  ───────●──────────            │                         │     │
│  0:00          3:45            │                       ↗│     │
│                                │                     ╱  │     │
│  Up Next:                      │                   ╱ Needle    │
│  ┌──────────────────┐          │                  ╱     │     │
│  │ Next Song 1      │          │                        │     │
│  │ Next Song 2      │          │    [◄◄]        [►►]    │     │
│  │ Next Song 3      │          └─────────────────────────┘     │
│  └──────────────────┘                                          │
│                                                                 │
│           Made by Navaneeth Sankar K P                         │
│         [LinkedIn]  [@navuxneeth/PixelTunes]                   │
│                                                                 │
│  [Playlist]  [Normal Player]                                   │
└─────────────────────────────────────────────────────────────────┘

     45% Width              55% Width
```

## Component Breakdown

### Left Panel (45% width)
1. **Album Art Card**
   - Square image view
   - 8dp corner radius
   - Shows current song's album cover

2. **Song Information**
   - Song title (20sp, VT323 font)
   - Artist name (16sp, VT323 font)
   - Centered alignment

3. **Progress Controls**
   - SeekBar for manual seeking
   - Current time / Total time display
   - 14sp VT323 font

4. **Playlist Preview**
   - "Up Next" header
   - RecyclerView showing 3 upcoming songs
   - Simple list layout with title and artist

### Right Panel (55% width)
1. **Vinyl Disc**
   - Circular CardView with black background
   - Concentric groove circles (drawable)
   - Rotates at 3 seconds per revolution when playing
   - Tap to play/pause
   - Touch and drag to seek with pitch adjustment

2. **Center Album Art**
   - Circular image (120dp diameter)
   - Shows same album as left panel
   - Rotates with the vinyl

3. **Draggable Needle Arm**
   - Positioned at top-right of vinyl
   - Pivot point at top-left corner
   - Rotation range: 0° (off) to 25° (on)
   - Drag to control playback
   - Snaps to on/off positions

4. **Control Buttons**
   - Previous and Next buttons
   - Positioned below vinyl
   - 48dp size for touch targets

### Attribution Footer
- Fixed at bottom
- "Made by Navaneeth Sankar K P" text
- LinkedIn button (opens profile)
- GitHub button (opens repository)
- 12sp VT323 font for consistency

## Interaction Flow

### Playback Control
```
User Action             →  Needle Position  →  Playback State
─────────────────────────────────────────────────────────────
Drag needle down        →  25° rotation    →  ▶ Playing
Drag needle up          →   0° rotation    →  ⏸ Paused
Tap vinyl disc          →  Toggle needle   →  Toggle play/pause
Press play button       →  Needle to 25°   →  ▶ Playing
```

### Manual Seeking with Pitch
```
User Action             →  Audio Effect              →  Visual Feedback
────────────────────────────────────────────────────────────────────
Rotate vinyl clockwise  →  Pitch +0.5x (fast)       →  Disc rotates
Rotate vinyl counter-   →  Pitch -0.5x (slow)       →  Disc rotates
  clockwise
Release vinyl           →  Pitch returns to 1.0x    →  Normal rotation
```

### Mode Switching
```
Current Mode    →  Button Click      →  New Mode        →  Layout
──────────────────────────────────────────────────────────────────
Normal Player   →  "Vinyl Player"    →  Vinyl Mode      →  Show vinyl
Vinyl Mode      →  "Normal Player"   →  Normal Mode     →  Hide vinyl
```

## Color Scheme (8-bit Style)
- Background: Theme dependent (light/dark)
- Vinyl disc: #1a1a1a (black)
- Grooves: #333333 (dark gray)
- Text: VT323 font (retro pixel style)
- Buttons: Material outlined style
- Cards: 8dp elevation for depth

## Responsive Design
- Constraints ensure proper sizing on all screen sizes
- Left panel: 45% width (min content)
- Right panel: 55% width (maintains aspect ratio)
- Attribution footer: Full width, minimal height
- All touch targets: 48dp minimum (accessibility)
