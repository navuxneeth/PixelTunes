# Building PixelTunes

Complete guide to building and running the PixelTunes Android application.

## Prerequisites

### Required Software
1. **Android Studio** (Hedgehog 2023.1.1 or later)
   - Download from: https://developer.android.com/studio
   
2. **Android SDK**
   - Minimum SDK: API 31 (Android 12)
   - Target SDK: API 34 (Android 14)
   - Required SDK components:
     - Android SDK Platform 34
     - Android SDK Build-Tools 34.0.0+
     - Android SDK Platform-Tools

3. **Java Development Kit (JDK)**
   - JDK 8 or later
   - Included with Android Studio

### Device Requirements
- Physical Android device with Android 12+ (API 31+)
- OR Android Emulator running Android 12+ system image

## Building with Android Studio

### Step 1: Clone the Repository
```bash
git clone https://github.com/navuxneeth/PixelTunes.git
cd PixelTunes
```

### Step 2: Open in Android Studio
1. Launch Android Studio
2. Select **"Open an Existing Project"**
3. Navigate to the cloned `PixelTunes` directory
4. Click **"OK"**

### Step 3: Wait for Gradle Sync
Android Studio will automatically:
- Download required dependencies
- Sync Gradle files
- Index the project

This may take a few minutes on first run.

### Step 4: Configure a Device

#### Option A: Physical Device
1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → System → Developer Options
   - Enable "USB Debugging"
2. Connect device via USB
3. Accept the USB debugging prompt on your device

#### Option B: Emulator
1. Click **Tools → Device Manager**
2. Click **"Create Device"**
3. Select a device definition (e.g., Pixel 5)
4. Select a system image with **API 31 or higher**
5. Click **"Finish"**

### Step 5: Build and Run
1. Select your device from the device dropdown
2. Click the **Run** button (▶️) or press **Shift+F10**
3. Android Studio will:
   - Build the APK
   - Install it on your device
   - Launch the app

## Building from Command Line

### Using Gradle Wrapper

#### Build Debug APK
```bash
./gradlew assembleDebug
```
Output: `app/build/outputs/apk/debug/app-debug.apk`

#### Build Release APK
```bash
./gradlew assembleRelease
```
Output: `app/build/outputs/apk/release/app-release-unsigned.apk`

#### Install on Connected Device
```bash
./gradlew installDebug
```

#### Run Tests
```bash
./gradlew test
```

#### Clean Build
```bash
./gradlew clean
```

### Installing APK Manually
```bash
# Install via ADB
adb install app/build/outputs/apk/debug/app-debug.apk

# Or for release
adb install app/build/outputs/apk/release/app-release.apk
```

## First Run Setup

When you first launch PixelTunes:

1. **Grant Storage Permission**
   - The app will request permission to read audio files
   - Tap **"Grant Permission"** or **"Allow"**
   - For Android 13+: Select "Allow" for audio files access

2. **Music Library Scan**
   - The app will automatically scan your device for audio files
   - This may take a few moments depending on library size

3. **Start Playing**
   - Your music will appear in the playlist
   - Tap any song to start playback
   - Use the player controls to navigate your music

## Troubleshooting

### Gradle Sync Issues
```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches/

# In Android Studio: File → Invalidate Caches / Restart
```

### Build Failures
1. Ensure you have the correct SDK installed
2. Check that `local.properties` points to your Android SDK
3. Try: **Build → Clean Project** then **Build → Rebuild Project**

### Permission Issues
- On Android 13+, ensure you grant "READ_MEDIA_AUDIO" permission
- On Android 12, ensure you grant "READ_EXTERNAL_STORAGE" permission
- Check Settings → Apps → PixelTunes → Permissions if needed

### No Music Found
1. Ensure audio files are in standard Android music directories:
   - `/storage/emulated/0/Music`
   - `/storage/emulated/0/Download`
2. Supported formats: MP3, FLAC, AAC, OGG, WAV, M4A
3. Files must be recognized as music by Android MediaStore

### ExoPlayer Issues
- ExoPlayer requires API 31+ (Android 12+)
- Ensure your device meets minimum requirements
- Check that audio files are not corrupted

## Development Tips

### Hot Reload
- Android Studio supports instant updates during development
- Changes to Kotlin code require app restart
- Changes to resources (XML, drawables) can be applied instantly

### Debugging
1. Set breakpoints in Kotlin code
2. Click **Debug** button (🐛) instead of Run
3. Use Android Studio's debugger to step through code

### Viewing Logs
```bash
# View all logs
adb logcat

# Filter by app
adb logcat | grep PixelTunes

# Or use Android Studio's Logcat panel
```

## Project Structure
```
PixelTunes/
├── app/
│   ├── build.gradle          # App dependencies
│   ├── src/
│   │   └── main/
│   │       ├── java/com/pixeltunes/app/
│   │       │   ├── MainActivity.kt
│   │       │   ├── PlaylistActivity.kt
│   │       │   ├── SettingsActivity.kt
│   │       │   ├── MusicService.kt
│   │       │   ├── MusicRepository.kt
│   │       │   ├── Song.kt
│   │       │   └── SongAdapter.kt
│   │       ├── res/
│   │       │   ├── layout/     # XML layouts
│   │       │   ├── values/     # Strings, colors, themes
│   │       │   ├── drawable/   # Icons and graphics
│   │       │   └── font/       # VT323 font
│   │       └── AndroidManifest.xml
├── build.gradle              # Root build config
├── settings.gradle           # Project modules
└── gradle.properties         # Gradle settings
```

## Performance Optimization

### Release Build
For production release with optimization:
```bash
./gradlew assembleRelease --stacktrace
```

### ProGuard
- ProGuard configuration is in `app/proguard-rules.pro`
- Enabled for release builds
- Keeps ExoPlayer classes intact

## Getting Help

If you encounter issues:
1. Check the [README.md](README.md) for general information
2. Review [SCREENSHOTS.md](SCREENSHOTS.md) for UI reference
3. Check Android Studio build output for specific errors
4. Ensure all prerequisites are correctly installed

## Next Steps

After successful build:
- Test all features (play, pause, next, previous, seek)
- Try both light and dark themes
- Test playlist navigation
- Verify audio quality with lossless formats (FLAC)
- Test on different Android versions (12, 13, 14, 15)
