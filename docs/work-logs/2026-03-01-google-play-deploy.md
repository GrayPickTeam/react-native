# Google Play Store 배포 작업

## 작업 목표
GrayPick Android 앱을 Google Play Store에 배포하기 위한 릴리즈 빌드 생성 및 Play Console 등록 진행

---

## 진행 단계

### 1. 릴리즈 키스토어 생성 ✅
- `keytool` 명령어로 PKCS12 형식의 릴리즈 키스토어 생성
- 파일 위치: `android/app/graypick-release.keystore`
- 키 별칭: `graypick-key-alias`
- 유효기간: 10000일

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/graypick-release.keystore -alias graypick-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 릴리즈 서명 설정 ✅

#### 보안 구조
| 파일 | 내용 | Git 추적 |
|------|------|----------|
| `android/app/graypick-release.keystore` | 키스토어 바이너리 | X (`.gitignore`에서 `*.keystore` 제외) |
| `android/gradle.properties` | 파일명, 키 별칭 (민감하지 않음) | O |
| `~/.gradle/gradle.properties` | 스토어/키 비밀번호 | X (로컬 전용) |

#### android/gradle.properties 추가 내용
```properties
# Release signing config (passwords stored in ~/.gradle/gradle.properties)
MYAPP_UPLOAD_STORE_FILE=graypick-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=graypick-key-alias
```

#### ~/.gradle/gradle.properties 생성 (신규)
```properties
# GrayPick release signing credentials
MYAPP_UPLOAD_STORE_PASSWORD=********
MYAPP_UPLOAD_KEY_PASSWORD=********
```

#### android/app/build.gradle 수정
- `signingConfigs`에 `release` 블록 추가
- `buildTypes.release`의 `signingConfig`를 `signingConfigs.debug` → `signingConfigs.release` 로 변경

### 3. AAB 릴리즈 빌드 ✅
```bash
cd android && ./gradlew bundleRelease
```
- 빌드 성공
- 출력 파일: `android/app/build/outputs/bundle/release/app-release.aab`

### 4. Play Console 배포 진행 중 🔄

#### 계정 문제 해결
- Play Console 접속 시 "계정에 문제가 있으므로 변경사항을 게시할 수 없습니다" 오류 발생
- → 계정 설정 확인 후 정상화

#### 앱 콘텐츠 설문 답변
| 항목 | 답변 | 비고 |
|------|------|------|
| 앱 액세스 권한 | 제한 없음 | 메인 콘텐츠는 로그인 없이 접근 가능 |
| 사용자 콘텐츠 공유 | 예 | 댓글 기능 존재 |
| 사용자 생성 콘텐츠가 주요 출처 | 아니요 | 주요 콘텐츠는 AI 법안 요약 |
| 노출 공유 허용 | 아니요 | 해당 없음 |
| 현실 폭력 공유 허용 | 아니요 | 해당 없음 |
| 사용자/콘텐츠 차단 기능 | 예 | 기능 존재 |
| 사용자/콘텐츠 신고 기능 | 예 | 기능 존재 |
| 채팅 조정 기능 | 예 | 댓글 관리 기능 존재 |
| 초대된 친구로만 제한 가능 | 아니요 | 공개 서비스 |
| 온라인 콘텐츠 제공 | 예 | 서버에서 법안 요약/댓글 등 로드 |
| 웹브라우저 또는 검색엔진 | 아니요 | 특정 서비스 래핑 앱 |
| 뉴스 또는 교육용 제품 | 아니요 | 정보 서비스로 분류 |

---

## 변경된 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `android/app/build.gradle` | release signingConfig 추가 |
| `android/gradle.properties` | 키스토어 파일명/별칭 추가 |
| `~/.gradle/gradle.properties` | 신규 생성 - 비밀번호 저장 |
| `android/app/graypick-release.keystore` | 신규 생성 (gitignore 적용) |

---

## 이슈 및 해결

### release 빌드가 debug.keystore 사용 문제
- **원인**: `build.gradle`의 `release` 빌드타입이 `signingConfigs.debug`를 참조하고 있었음
- **해결**: `signingConfigs.release` 블록 추가 및 참조 변경

### 비밀번호 git 노출 위험
- **원인**: `gradle.properties`는 `.gitignore` 미적용 상태
- **해결**: 비밀번호는 `~/.gradle/gradle.properties`(전역)에만 저장, 프로젝트 파일에는 비민감 정보만 기록

---

## 다음 할 일
- [ ] Play Console 앱 콘텐츠 설문 나머지 항목 완료
- [ ] AAB 파일 Play Console에 업로드
- [ ] 내부 테스트 트랙 배포 후 검토
- [ ] 프로덕션 배포
