# Android APK 빌드 가이드

## 📱 APK 빌드 방법

### Debug APK (개발용)
Metro bundler에 연결되는 APK. Metro 실행 중이어야 동작.

```bash
cd android
./gradlew assembleDebug
```

**출력 위치**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Release APK (배포용)
JS 번들이 포함되어 독립 실행 가능한 APK.

```bash
cd android
./gradlew assembleRelease
```

**출력 위치**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔧 빌드 옵션

### Clean 빌드 (기존 파일 삭제 후 빌드)
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### 빌드 상태 확인
```bash
./gradlew tasks --all | grep assemble
```

### 빌드 로그 상세히 보기
```bash
./gradlew assembleRelease --info
```

---

## 📊 빌드 타입 비교

| 빌드 타입 | 명령어 | JS 번들 | Metro 필요 | 크기 | 용도 |
|---------|--------|--------|-----------|------|------|
| Debug | `assembleDebug` | ❌ | ✅ 필요 | 작음 | 개발/테스트 |
| Release | `assembleRelease` | ✅ 포함 | ❌ 불필요 | 큼 | 배포 |

---

## 🎯 빌드 전 체크리스트

- [ ] `npm install` 완료
- [ ] `android/app/google-services.json` 존재 (Firebase 사용 시)
- [ ] `android/gradle.properties` 설정 확인
- [ ] Keystore 파일 준비 (Release 빌드 시)

---

## 🚨 문제 해결

### 1. "Unable to load script" 에러
→ Release APK 빌드 필요 (`assembleRelease`)

### 2. 경로 길이 제한 에러 (Windows)
```
gradle.properties에서
newArchEnabled=false
```

### 3. 빌드 실패 시 캐시 삭제
```bash
cd android
./gradlew clean
./gradlew cleanBuildCache
```

---

## 📦 APK 크기 줄이기

### 1. ProGuard 활성화
`android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
    }
}
```

### 2. 특정 아키텍처만 빌드
```bash
# ARM64만 빌드 (최신 폰)
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

### 3. APK 분할 (App Bundle 사용)
```bash
./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔐 Production 빌드 (Play Store용)

### 1. Release Keystore 생성
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 2. gradle.properties에 설정
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

### 3. build.gradle 수정
```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_RELEASE_STORE_FILE)
        storePassword MYAPP_RELEASE_STORE_PASSWORD
        keyAlias MYAPP_RELEASE_KEY_ALIAS
        keyPassword MYAPP_RELEASE_KEY_PASSWORD
    }
}
```

---

## 📚 참고 문서
- [React Native 공식 빌드 가이드](https://reactnative.dev/docs/signed-apk-android)
- [Gradle 공식 문서](https://developer.android.com/studio/build)
- [APK vs AAB 비교](https://developer.android.com/guide/app-bundle)
