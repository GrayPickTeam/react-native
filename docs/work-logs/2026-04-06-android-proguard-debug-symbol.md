# Android ProGuard + 디버그 기호 설정

## 작업 목표
- Play Console 경고 2개 해결 (4-05 작업에서 미뤄둔 항목)
  1. 디버그 기호 없음 → `ndk { debugSymbolLevel 'FULL' }` 추가
  2. 난독화 미적용 → ProGuard 활성화

## 진행 단계

### 1. ProGuard 활성화
- `enableProguardInReleaseBuilds = false` → `true`
- `shrinkResources` 도 함께 활성화 (리소스 제거로 앱 크기 축소)
- `proguard-android.txt` → `proguard-android-optimize.txt` 로 변경 (더 강력한 최적화)

### 2. 디버그 기호 설정
- release buildType에 `ndk { debugSymbolLevel 'FULL' }` 추가
- AAB 빌드 시 Play Console에 자동 업로드됨

### 3. ProGuard 규칙 추가 (`proguard-rules.pro`)
- React Native 클래스 보존
- Firebase / GMS 클래스 보존
- WebView JavascriptInterface 보존

## 변경된 파일 목록
- `android/app/build.gradle`
- `android/app/proguard-rules.pro`

## 이슈 및 해결
- 없음

## 다음 할 일
- [ ] `./gradlew bundleRelease` 빌드 성공 확인
- [ ] 에뮬레이터 or 실기기에서 Release 빌드 테스트 (WebView, 카카오 로그인, 푸시 알림)
- [ ] 문제 없으면 Play Store 내부 테스트 트랙에 업로드
