# PixelTunes Android App 📱

A mobile lossless audio player for Android with pixel-themed Material Design.

## Features

- **Lossless Audio Formats**: Supports FLAC, WAV, ALAC, MP3, OGG
- **Material Design**: Modern UI with retro pixel aesthetics
- **Background Playback**: Keep listening while using other apps
- **Lock Screen Controls**: Control playback from lock screen
- **Playlist Support**: Queue and manage multiple tracks
- **Permission Handling**: Secure audio file access

## Requirements

- Android 7.0 (API 24) or higher
- Storage permission for accessing audio files

## Building the App

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or newer
- JDK 11 or higher
- Android SDK 34

### Build Instructions

1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to the `android` folder
4. Wait for Gradle sync to complete
5. Click "Run" or press Shift+F10

### Command Line Build

```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build

```bash
./gradlew assembleRelease
```

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/pixeltunes/
│   │       │   ├── MainActivity.kt       # Main UI activity
│   │       │   └── AudioService.kt       # Background playback service
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml # UI layout
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   ├── colors.xml        # Pixel theme colors
│   │       │   │   └── themes.xml
│   │       │   └── drawable/
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## Key Components

### MainActivity
- Handles UI and user interactions
- Manages MediaPlayer lifecycle
- Implements playback controls
- Handles file selection

### AudioService
- Background playback support
- Foreground service for continuous playback
- Lock screen integration

## Permissions

The app requires the following permissions:

- `READ_EXTERNAL_STORAGE` (Android 12 and below)
- `READ_MEDIA_AUDIO` (Android 13+)
- `FOREGROUND_SERVICE` (for background playback)
- `WAKE_LOCK` (to prevent sleep during playback)

## Dependencies

- AndroidX Core KTX
- AndroidX AppCompat
- Material Components
- AndroidX Media
- Kotlin Coroutines

## Customization

### Theme Colors

Edit `app/src/main/res/values/colors.xml`:

```xml
<color name="pixel_primary">#00FF9F</color>
<color name="pixel_secondary">#FF6B9D</color>
<color name="pixel_accent">#FFD700</color>
```

### Strings

Edit `app/src/main/res/values/strings.xml` to change app text.

## Testing

Run unit tests:
```bash
./gradlew test
```

Run instrumented tests:
```bash
./gradlew connectedAndroidTest
```

## Known Limitations

- Does not include a media library browser
- Requires manual file selection
- Basic metadata display (filename only)
- No equalizer or audio effects

## Future Enhancements

- [ ] Automatic media library scanning
- [ ] Album art display
- [ ] ID3 tag parsing
- [ ] Equalizer controls
- [ ] Sleep timer
- [ ] Widget support
- [ ] Android Auto support

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check that you have JDK 11+ installed
2. Ensure Android SDK 34 is installed
3. Try "File > Invalidate Caches" in Android Studio
4. Clean and rebuild: `./gradlew clean build`

### Permission Denied

If the app can't access files:
1. Check app permissions in Android settings
2. Grant storage/media permissions
3. Try reinstalling the app

## Contributing

Contributions are welcome! Please ensure:
- Code follows Kotlin style guide
- UI maintains pixel theme aesthetics
- Functionality is tested on multiple Android versions

## License

MIT License - see parent LICENSE file for details
