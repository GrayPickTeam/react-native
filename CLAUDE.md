# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GrayPick is a React Native WebView application that wraps the production website (https://graypick.co.kr). The app is built with TypeScript and uses minimal native functionality.

## Essential Commands

### Development
```bash
# Start Metro bundler (required before running the app)
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run tests
npm test

# Run linting
npm run lint
```

### iOS-specific Commands
```bash
# Install CocoaPods (first time setup)
cd ios && bundle install

# Install/update iOS dependencies
cd ios && bundle exec pod install

# Open in Xcode
open ios/graypick.xcworkspace
```

## Architecture

The application follows a feature-based architecture:

```
src/
├── features/webview/     # WebView implementation
│   └── components/
│       ├── HomeScreen.tsx      # Main screen with safe area handling
│       └── WebviewScreen.tsx   # WebView wrapper component
└── shared/
    ├── components/         # Shared UI components
    └── const/urls.ts      # Contains SOURECE_URL constant
```

Key architectural decisions:
- Single WebView screen application (no navigation library)
- No state management library (simple app structure)
- react-native-webview for WebView functionality
- Safe area handling with react-native-safe-area-context

## Current Implementation Issues

### OAuth Login Problem
The WebView currently has issues with Kakao OAuth login:
- The web app uses window.opener and postMessage for OAuth callback handling
- React Native WebView doesn't support window.opener
- Login process gets stuck at "로그인 처리 중입니다..." message

### Deep Linking Requirements
To resolve the OAuth issue, the app needs:
1. Deep linking configuration for OAuth callbacks
2. WebView message handling for communication with the web app
3. Native OAuth redirect handling

## Common Troubleshooting

### Metro Bundler Issues
If you see "No script URL provided" error in Xcode:
1. Ensure Metro is running: `npm start`
2. Check Metro is accessible at http://localhost:8081
3. Clean and rebuild if necessary

### iOS Build Issues
- Always run `pod install` after adding new dependencies
- Use the `.xcworkspace` file, not `.xcodeproj`
- Ruby version must be >= 2.6.10

## Key Dependencies

- **react-native**: 0.81.4
- **react-native-webview**: ^13.16.0 (WebView functionality)
- **react-native-safe-area-context**: ^5.5.2 (Safe area handling)
- **TypeScript**: ^5.8.3

## Platform Configurations

### iOS (Info.plist)
- NSAppTransportSecurity configured for HTTPS only
- No arbitrary loads allowed (secure configuration)
- Portrait and landscape orientations supported

### Android
- Application ID: com.graypick
- Debug keystore configured
- Hermes JavaScript engine available

## Work Log 규칙

작업 시 반드시 `docs/work-logs/` 폴더에 작업 로그를 기록한다.

### 파일명 규칙
- 형식: `YYYY-MM-DD-<작업주제>.md` (예: `2026-02-15-firebase-push-setup.md`)

### 로그 포함 내용
1. **작업 목표**: 무엇을 하려는지
2. **진행 단계**: 각 단계별 수행 내용과 결과
3. **변경된 파일 목록**: 수정/생성/삭제된 파일
4. **이슈 및 해결**: 발생한 문제와 해결 방법
5. **다음 할 일**: 후속 작업이 있다면 기록