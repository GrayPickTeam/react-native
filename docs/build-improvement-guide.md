# 빌드 개선 가이드 (추후 작업)

Play Console 경고 해결을 위한 작업 내용입니다.

---

## 1. 디버그 기호 업로드 (우선순위 높음)

부작용 없으므로 **다음 배포 시 바로 적용 가능**합니다.

`android/app/build.gradle`의 release 블록에 추가:

```gradle
buildTypes {
    release {
        // 기존 설정 유지
        ...

        // 디버그 기호 추가
        ndk {
            debugSymbolLevel 'FULL'
        }
    }
}
```

빌드 후 Play Console에서 자동으로 기호 파일이 업로드됩니다.

---

## 2. ProGuard 난독화 (우선순위 낮음)

앱 크기 축소 + 코드 보호 효과가 있지만, **잘못 설정하면 런타임 크래시** 발생 가능.
React Native + Firebase 조합에서 규칙을 꼼꼼히 설정해야 합니다.

### 적용 방법

`android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

`android/app/proguard-rules.pro`에 아래 규칙 추가:

```proguard
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# WebView JavaScript Interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
```

### 적용 전 체크리스트
- [ ] Debug 빌드로 먼저 테스트
- [ ] Release 빌드 후 에뮬레이터에서 전체 기능 테스트
- [ ] 카카오 로그인, 푸시 알림, WebView 동작 확인
- [ ] 문제 없으면 Play Store 내부 테스트 트랙에 올려서 검증
