# Android 빌드 가이드

## 1. 버전 수정

출시 전 반드시 두 파일의 버전을 올려야 합니다.

### `android/app/build.gradle`

```gradle
versionCode 3          // 정수, 매 출시마다 +1 증가
versionName "1.02"     // 사용자에게 보이는 버전명
```

> **규칙**: `versionCode`는 Play Console에 등록된 마지막 값보다 반드시 커야 합니다.

---

## 2. AAB 빌드 (Play Store 배포용)

```bash
cd android
./gradlew bundleRelease
```

**출력 위치**: `android/app/build/outputs/bundle/release/app-release.aab`

> Play Store는 APK가 아닌 **AAB** 파일을 요구합니다.

---

## 3. 빌드 실패 시

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

---

## 4. 버전 이력

| versionCode | versionName | 내용 |
|-------------|-------------|------|
| 1           | 1.0         | 최초 출시 |
| 2           | 1.01        | - |
| 3           | 1.02        | 도메인 graypick.co.kr 적용 |
