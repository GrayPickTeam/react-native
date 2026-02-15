# Firebase Push 알림 서비스 구현

## 작업 목표
Firebase Cloud Messaging(FCM)을 연동하여 "최신 법안이 업데이트 되었습니다" 푸시 알림을 모든 사용자에게 발송할 수 있는 기능 구현. Topic 기반(`law-updates`) 구독 방식 사용.

## 진행 단계

### Step 1: 패키지 설치 - 완료
- [x] `@react-native-firebase/app` 설치
- [x] `@react-native-firebase/messaging` 설치
- 97개 패키지 추가됨

### Step 2: Android Gradle 설정 - 완료
- [x] `android/build.gradle` - `com.google.gms:google-services:4.4.2` classpath 추가
- [x] `android/app/build.gradle` - `apply plugin: "com.google.gms.google-services"` 추가

### Step 3: 푸시 알림 서비스 코드 - 완료
- [x] `src/shared/services/pushNotification.ts` 생성
  - `initializePushNotification()`: 권한 요청 + 토큰 획득 + `law-updates` 토픽 구독
  - `onForegroundMessage()`: foreground 알림 수신 시 Alert 표시
  - `registerBackgroundHandler()`: background 메시지 핸들러

### Step 4: 앱 진입점 연동 - 완료
- [x] `index.js` - `registerBackgroundHandler()` 호출 (AppRegistry 전에)
- [x] `App.tsx` - useEffect에서 `initializePushNotification()` + `onForegroundMessage()` 리스너 등록

### Step 5: 보안 설정 - 완료
- [x] `.gitignore`에 `service-account-key.json`, `google-services.json` 추가

### Step 6: 테스트 발송 - 완료
- [x] Firebase 콘솔에서 `law-updates` 토픽으로 알림 발송 성공 (2026.02.15 AM 11:30)
- [x] 에뮬레이터에서 Alert 팝업 수신 확인

## 변경된 파일 목록
| 파일 | 변경 유형 |
|------|----------|
| `android/build.gradle` | 수정 - google-services classpath 추가 |
| `android/app/build.gradle` | 수정 - google-services 플러그인 추가 |
| `index.js` | 수정 - background 핸들러 등록 |
| `App.tsx` | 수정 - 푸시 알림 초기화 및 foreground 리스너 |
| `src/shared/services/pushNotification.ts` | 신규 - FCM 서비스 로직 |
| `.gitignore` | 수정 - Firebase 관련 파일 제외 |
| `package.json` / `package-lock.json` | 수정 - Firebase 의존성 추가 |
| `android/app/google-services.json` | 신규 - Firebase 설정 (gitignore 대상) |

## 수동 알림 발송 방법
1. https://console.firebase.google.com → `graypick-app` 프로젝트
2. 왼쪽 메뉴 **Messaging** 클릭
3. **"새 캠페인"** → **"Firebase 알림 메시지"** 선택
4. 제목/본문 입력 → 타겟: 토픽 `law-updates` → **검토** → **게시**
- 기존에 보냈던 캠페인을 **복제**해서 재사용도 가능

## 이슈 및 해결
- Play Protect 경고: 에뮬레이터 전용 이슈, 실제 기기에서는 발생하지 않음
- 알림 권한 팝업 미노출: 에뮬레이터가 자동 허용 처리, 실제 기기에서는 팝업 표시됨
