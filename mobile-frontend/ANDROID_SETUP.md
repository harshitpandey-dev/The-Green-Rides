# 🤖 Android Development Setup Guide

## Required Software Installation

### 1. Install Node.js

```powershell
# Download from https://nodejs.org/
# Or use Chocolatey:
choco install nodejs-lts
```

### 2. Install Java JDK 17

```powershell
# Using Chocolatey:
choco install microsoft-openjdk17

# Or download from:
# https://learn.microsoft.com/en-us/java/openjdk/download
```

### 3. Install Android Studio

1. Download from: https://developer.android.com/studio
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
   - Performance (Intel HAXM) - for emulator acceleration

### 4. Configure Android Studio

1. Open Android Studio
2. Go to **File → Settings → Appearance & Behavior → System Settings → Android SDK**
3. Install the following:
   - **SDK Platforms**: Android 13 (API Level 33) or higher
   - **SDK Tools**:
     - Android SDK Build-Tools
     - Android SDK Command-line Tools
     - Android SDK Platform-Tools
     - Android Emulator
     - Intel x86 Emulator Accelerator (HAXM installer)

### 5. Set Environment Variables

#### Option A: Through System Properties (Recommended)

1. Search for "Environment Variables" in Windows
2. Click "Environment Variables..."
3. Add these System Variables:

```
Variable Name: JAVA_HOME
Variable Value: C:\Program Files\Microsoft\jdk-17.x.x.x-hotspot

Variable Name: ANDROID_HOME
Variable Value: C:\Users\{YourUsername}\AppData\Local\Android\Sdk
```

4. Edit the `Path` variable and add:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\cmdline-tools\latest\bin
```

#### Option B: Through PowerShell (Temporary)

```powershell
# Set for current session
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.x.x.x-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

### 6. Verify Installation

```powershell
# Check Java
java -version

# Check Android SDK
adb version

# Check if SDK manager works
sdkmanager --list
```

## 🎯 Create Android Virtual Device (AVD)

### Using Android Studio:

1. Open Android Studio
2. Click on "More Actions" → "AVD Manager"
3. Click "Create Virtual Device"
4. Choose a device definition (e.g., Pixel 4)
5. Select a system image (API Level 33+ recommended)
6. Configure AVD settings and click "Finish"
7. Start the emulator by clicking the play button

### Using Command Line:

```powershell
# List available devices
avdmanager list device

# Create AVD
avdmanager create avd -n GreenRidesEmulator -k "system-images;android-33;google_apis;x86_64" -d pixel_4

# Start emulator
emulator -avd GreenRidesEmulator
```

## 📱 Setup for Physical Device

### Enable Developer Options:

1. Go to **Settings → About Phone**
2. Tap "Build Number" 7 times
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging**
5. Enable **Install via USB** (if available)

### Connect Device:

1. Connect via USB cable
2. Allow USB debugging when prompted
3. Verify connection: `adb devices`

## 🚀 Running the App

### Prerequisites:

1. **Backend server must be running** on port 5000
2. **Android emulator or physical device** must be connected
3. **Metro bundler** will start automatically

### Commands:

```powershell
# Navigate to project
cd "D:\Projects\Personal\The-Green-Rides\mobile-frontend"

# Install dependencies (first time only)
npm install

# Accept Android licenses
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager --licenses

# Start the application
npx react-native run-android
```

### For Physical Device:

1. Update API URL in `src/utils/api.util.js`:

```javascript
baseURL: 'http://YOUR_LOCAL_IP:5000/api';
```

2. Find your local IP:

```powershell
ipconfig
# Look for IPv4 Address (usually 192.168.x.x)
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. "SDK location not found"

**Solution A: Create/Update local.properties file**

```powershell
# Navigate to android folder
cd "D:\Projects\Personal\The-Green-Rides\mobile-frontend\android"

# Create local.properties with correct SDK path
echo "sdk.dir=C:\\Users\\{YourUsername}\\AppData\\Local\\Android\\Sdk" > local.properties

# Replace {YourUsername} with your actual Windows username
# Example: sdk.dir=C:\\Users\\Harshit-Inteligenai\\AppData\\Local\\Android\\Sdk
```

**Solution B: Set environment variables permanently**

```powershell
# Set ANDROID_HOME permanently (run as Administrator)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "Machine")

# Add to PATH permanently
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
$newPath = "$currentPath;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\tools;$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
```

**Solution C: Set for current session (temporary)**

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

#### 2. "Unable to load script from assets"

```powershell
# Reset Metro cache
npx react-native start --reset-cache

# Or in separate terminal:
npx react-native start
# Then in another terminal:
npx react-native run-android
```

#### 3. "Gradle build failed"

```powershell
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

#### 4. "Device not found"

```powershell
# Restart ADB
adb kill-server
adb start-server
adb devices
```

#### 5. "Metro port already in use"

```powershell
# Find process using port 8081
netstat -ano | findstr :8081
# Kill the process (replace PID with actual process ID)
taskkill /PID 1234 /F
```

#### 6. **"Could not resolve project :react-native-camera" / Variant Ambiguity**

**Error**: Gradle cannot choose between `generalDebugApiElements` and `mlkitDebugApiElements` variants.

**Solution**: Add the missing dimension strategy to resolve variant ambiguity:

1. Open `android/app/build.gradle`
2. In the `android.defaultConfig` section, add:

```gradle
android {
    // ... other config
    defaultConfig {
        // ... other settings
        missingDimensionStrategy 'react-native-camera', 'general'
    }
}
```

3. Clean and rebuild:

```powershell
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

#### 7. Network Connection Issues:

- Ensure Windows Firewall allows Node.js
- Check if antivirus is blocking connections
- Try using your computer's IP address instead of localhost

### Performance Tips:

1. **Use Physical Device**: Better performance than emulator
2. **Enable Developer Mode**: In React Native app, shake device → Enable Fast Refresh
3. **Close Unused Apps**: Free up RAM for better emulator performance
4. **Use SSD**: Install Android SDK on SSD for faster builds

### Debug Tools:

1. **Chrome DevTools**: In running app, shake device → Debug with Chrome
2. **Flipper**: Facebook's debugging platform (optional)
3. **ADB Logcat**: `adb logcat | findstr ReactNativeJS`

## ✅ Verification Checklist

Before running the app, ensure:

- [x] Node.js installed (v18+)
- [x] Java JDK 17 installed
- [x] Android Studio installed with SDK
- [x] Environment variables set correctly
- [x] Android emulator created and running OR physical device connected
- [x] Backend server running on port 5000 (optional for initial testing)
- [x] Dependencies installed (`npm install`)
- [x] React-native-camera variant conflict resolved

## 🎉 **BUILD SUCCESSFUL!**

The mobile app has been successfully built and installed on the Android emulator. The build completed in approximately 12 minutes and 33 seconds with the following achievements:

✅ **Fixed react-native-camera variant ambiguity** by adding `missingDimensionStrategy 'react-native-camera', 'general'`  
✅ **Successfully compiled** all native modules including gesture handler and screens  
✅ **Installed APK** on Pixel_9a(AVD) emulator  
✅ **Connected to Metro bundler** on port 8081  
✅ **App launched successfully** with MainActivity

The app is now ready for testing and development!

## 🆘 Getting Help

If you encounter issues:

1. Check the [React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting)
2. Verify all environment variables are set correctly
3. Restart Android Studio, emulator, and Metro bundler
4. Check the console logs for detailed error messages
5. Try running on a physical device if emulator issues persist
