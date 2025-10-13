
# PixelTunes

PixelTunes is a dual-platform music experience project featuring both an **Android app** and a **web-based version**. Users can enjoy a vinyl-inspired interface to play tracks and explore albums with a visually rich, interactive experience.

---

## Screenshots

![Mobile site preview](https://github.com/user-attachments/assets/def9ac8b-d062-464d-ac73-ec67d8352e98)

---

---

## Table of Contents

<details>
  <summary>Project Structure</summary>

  ```
  PixelTunes/
  ├── app/                      # Android app source code
  ├── app-debug.apk             # Prebuilt Android debug APK
  ├── build.gradle              # Gradle build configuration
  ├── gradle.properties
  ├── gradle/
  ├── gradlew
  ├── index.html                # Root landing page
  ├── output-metadata.json
  ├── sample.mp3                # Example audio file
  ├── sample_cover.jpg          # Example album cover
  ├── screenshots/              # Screenshots directory
  ├── settings.gradle
  ├── web/                      # Web version source code
  │   ├── index.html
  │   ├── QUICKSTART.md
  │   ├── README.md
  │   ├── TESTING.md
  │   ├── VINYL_PLAYER.md
  │   ├── VINYL_QUICKSTART.md
  │   ├── css/
  │   ├── js/
  │   ├── manifest.json
  │   └── service-worker.js
  ├── BUILDING.md
  ├── FEATURES.md
  ├── IMPLEMENTATION_SUMMARY.md
  ├── QUICKSTART.md
  ├── SCREENSHOTS.md
  ├── VINYL_LAYOUT.md
  ├── VINYL_PLAYER_FEATURES.md
  ├── VINYL_QUICK_START.md
  ├── VINYL_README.md
  ├── WEB_VERSION.md
  └── WEB_VINYL_IMPLEMENTATION.md
  ```
</details>

---

## Project Overview

PixelTunes has two main components:

### 1. Android App

- **Source:** See the `app/` folder for source code.
- **Installation:** Download [app-debug.apk](https://github.com/navuxneeth/PixelTunes/blob/main/app-debug.apk) to install the app directly.
- **Features:** The app provides a vinyl-style player for local music files, album cover visualization, and interactive track controls.
- **Documentation:** See [QUICKSTART.md](https://github.com/navuxneeth/PixelTunes/blob/main/QUICKSTART.md), [FEATURES.md](https://github.com/navuxneeth/PixelTunes/blob/main/FEATURES.md), and [VINYL_PLAYER_FEATURES.md](https://github.com/navuxneeth/PixelTunes/blob/main/VINYL_PLAYER_FEATURES.md).

### 2. Website Version

- **Source:** All web resources are under the `web/` folder.  
  Main entry point: [web/index.html](https://github.com/navuxneeth/PixelTunes/blob/main/web/index.html)
- **Features:** A browser-based vinyl player, mimicking the app experience, with interactive album artwork and track manipulation.
- **Documentation:**
  - [web/README.md](https://github.com/navuxneeth/PixelTunes/blob/main/web/README.md) — General overview
  - [web/QUICKSTART.md](https://github.com/navuxneeth/PixelTunes/blob/main/web/QUICKSTART.md) — Getting started
  - [web/VINYL_PLAYER.md](https://github.com/navuxneeth/PixelTunes/blob/main/web/VINYL_PLAYER.md) — Vinyl player details
  - [web/TESTING.md](https://github.com/navuxneeth/PixelTunes/blob/main/web/TESTING.md) — Testing instructions

---

## How PixelTunes Works

- **Vinyl UI:** Both the app and web versions feature a vinyl record interface. Album covers are displayed as clickable records, which spin when a track plays.
- **Audio Playback:** Users can select tracks, view album art, and control playback. The system leverages native audio APIs (Android MediaPlayer, HTML5 Audio).
- **Interactivity:** Drag-and-drop, swipe gestures (in app), or mouse interactions (on web) allow users to navigate albums and playlists.
- **Progress & Features:** Detailed feature lists and implementation summaries are available in respective `.md` files for both versions.
- **Web PWA:** The web version supports offline playback and installable Progressive Web App features via service workers and manifest files.

---

## Getting Started

- **Android:** Download and install the APK, or build from source using Gradle.
- **Web:** Open `web/index.html` in your browser, or deploy the `web/` folder to a static hosting service.

See [QUICKSTART.md](https://github.com/navuxneeth/PixelTunes/blob/main/QUICKSTART.md) and [web/QUICKSTART.md](https://github.com/navuxneeth/PixelTunes/blob/main/web/QUICKSTART.md) for step-by-step instructions.



## Documentation

Explore these files for more details:
- [BUILDING.md](https://github.com/navuxneeth/PixelTunes/blob/main/BUILDING.md) — Build instructions
- [FEATURES.md](https://github.com/navuxneeth/PixelTunes/blob/main/FEATURES.md) — Feature list
- [IMPLEMENTATION_SUMMARY.md](https://github.com/navuxneeth/PixelTunes/blob/main/IMPLEMENTATION_SUMMARY.md) — Detailed implementation notes
- [WEB_VERSION.md](https://github.com/navuxneeth/PixelTunes/blob/main/WEB_VERSION.md) — Web version details
- [VINYL_README.md](https://github.com/navuxneeth/PixelTunes/blob/main/VINYL_README.md) — Vinyl UI documentation

---

## Contributing

Contributions are welcome! Please open issues or pull requests as needed.

---

## License

See `LICENSE` (if present) for licensing details.
