# 2026-02-20 릴리스 빌드 설정 및 배포 준비

## 작업 목표
- 독립 실행 가능한 릴리스 APK 생성
- 알림(FCM) 권한 설정 확인 및 구성
- 배포 준비 완료

## 진행 단계

### 1. 현재 상태 확인
- 문제: 개발용 APK 실행 시 "Unable to load script" 에러 발생
- 원인: Debug 빌드는 Metro bundler 필요, 독립 실행 불가
- 해결: Release APK 생성 필요

### 2. 알림 권한 설정 확인 완료
- ✅ Firebase 의존성 확인: @react-native-firebase/app, messaging
- ✅ google-services.json 파일 존재
- ✅ Google Services 플러그인 설정 확인
- ❌ AndroidManifest.xml에 알림 권한 누락 → 추가 완료

### 3. AndroidManifest.xml 권한 추가
추가된 권한:
- `POST_NOTIFICATIONS`: Android 13+ 알림 권한
- `RECEIVE_BOOT_COMPLETED`: 부팅 후 FCM 토큰 갱신
- `VIBRATE`: 알림 진동

### 4. 릴리스 빌드 준비
- 현재: debug.keystore만 존재
- 릴리스 빌드: debug keystore로 서명 (테스트/내부 배포용)
- 참고: 실제 Play Store 배포 시에는 별도 release keystore 필요

### 5. Windows 경로 길이 제한 문제 해결
**문제**: C++ 네이티브 모듈 빌드 시 경로 길이 260자 초과
```
ninja: error: Stat(...RNCSafeAreaViewShadowNode.cpp.o): Filename longer than 260 characters
```

**해결**: gradle.properties에서 `newArchEnabled=false` 설정
- 새 아키텍처 비활성화로 C++ 빌드 우회
- 앱 기능에는 영향 없음

### 6. 릴리스 APK 빌드 성공 ✅
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**결과**:
- 빌드 시간: 2분 7초
- APK 크기: 46MB
- 위치: `android/app/build/outputs/apk/release/app-release.apk`
- JS 번들 포함됨 (Metro bundler 불필요)

## 변경된 파일 목록
- `android/app/src/main/AndroidManifest.xml`: FCM 알림 권한 추가
- `android/gradle.properties`: newArchEnabled=false (경로 길이 문제 해결)

## 이슈 및 해결
1. **Debug APK의 Metro 의존성 문제**
   - 원인: Debug 빌드는 Metro bundler 필요
   - 해결: Release APK 생성으로 독립 실행 가능

2. **Windows 경로 길이 제한**
   - 원인: 새 아키텍처 C++ 빌드 시 경로 260자 초과
   - 해결: newArchEnabled=false로 설정

## 최종 빌드 완료 ✅

### 2차 빌드 (2026-02-20 15:45)
- FCM 권한 로직 개선 적용
- 빌드 시간: 27초
- APK 크기: 46MB
- 위치: `android/app/build/outputs/apk/release/app-release.apk`

### 변경 사항 요약
1. AndroidManifest.xml: FCM 알림 권한 추가
2. gradle.properties: newArchEnabled=false (경로 길이 문제 해결)
3. pushNotification.ts: 개선된 권한 요청 로직
   - Android 버전별 권한 처리
   - DENIED vs NEVER_ASK_AGAIN 구분
   - 권한 없어도 앱 정상 실행

## 참고사항

### Android 11+ 권한 UI 변경
- "다시 묻지 않음" 체크박스가 표시되지 않음 (정상 동작)
- 시스템이 2번 거부 시 자동으로 영구 차단 처리
- React Native의 NEVER_ASK_AGAIN 반환은 불안정하지만, 기능적으로 문제없음
- 현재 코드 유지 결정

## 다음 할 일
- ✅ APK 설치 완료
- FCM 알림 권한 팝업 동작 확인
- 푸시 알림 수신 테스트
- 실제 Play Store 배포 시 release keystore 생성 필요

---

## 추가 작업: FCM 권한 요청 개선 (2026-02-20 오후)

### 문제
- 갤럭시 퀀텀(Android 12 이하)에서 알림 권한 팝업이 안 뜸
- 기존 코드: Android 13+에서만 권한 요청
- Android 12 이하에서는 권한 요청 로직이 실행되지 않음

### 해결
`src/shared/services/pushNotification.ts` 수정:
- Android 13+: `PermissionsAndroid.request()` 사용 (명시적 런타임 권한)
- Android 12 이하: `messaging().requestPermission()` 사용 (Firebase 권한)
- 모든 Android 버전에서 권한 상태 로그 출력
- 권한 거부 시 사용자 안내 Alert 추가

### 변경 파일 (1차)
- `src/shared/services/pushNotification.ts`: Android 권한 요청 로직 개선

### 추가 개선 (2차)
**문제**: 거부한 사용자에게 앱 실행 시마다 Alert 표시
**해결**:
- `check()` 먼저 호출하여 권한 상태 확인
- 이미 허용됨: 조용히 진행
- 권한 없음: `request()` 호출 (최초 1회만 팝업)
- 거부됨: Alert 없이 조용히 종료

**UX 개선 (최종)**:
- 최초 실행: 권한 팝업 표시
- 허용 후: 더 이상 팝업 없음
- 일반 거부 (DENIED): 다음 실행 시 다시 팝업 표시 (재요청 가능)
- "다시 묻지 않음" (NEVER_ASK_AGAIN): 완전 포기, 더 이상 팝업 없음

**로직**:
```typescript
if (granted === GRANTED) {
  // 허용됨
} else if (granted === NEVER_ASK_AGAIN) {
  // "다시 묻지 않음" 선택 → 포기
} else {
  // DENIED → 다음 실행 시 재요청
}
```
