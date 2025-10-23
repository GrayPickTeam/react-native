import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface Props {
  uri: string;
}

const WebviewScreen = ({ uri }: Props) => {
  const mainWebViewRef = useRef<WebView>(null);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);

  // ✅ window.open / window.close 오버라이드
  const injectedJavaScript = `
    (function() {
      const originalOpen = window.open;
      window.open = function(url, target, features) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_POPUP', url }));
      };
      window.close = function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CLOSE_POPUP' }));
      };
    })();
    true;
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'OPEN_POPUP' && data.url) {
        // ✅ 팝업창으로 띄울 URL
        setPopupUrl(data.url);
      } else if (data.type === 'CLOSE_POPUP') {
        setPopupUrl(null);
      }
    } catch (e) {
      console.warn('메시지 파싱 실패:', e);
    }
  };

  const handleClosePopup = () => {
    // RN에서 팝업 닫기
    setPopupUrl(null);

    // 웹 쪽에서도 window.close() 호출 시도 (있으면 동작)
    try {
      mainWebViewRef.current?.injectJavaScript(`
        try { window.close && window.close(); } catch(e) {}
        true;
      `);
    } catch (e) {
      // noop
    }
  };

  return (
    <View style={styles.container}>
      {/* 메인 WebView */}
      <WebView
        ref={mainWebViewRef}
        source={{ uri }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
      />

      {/* ✅ 팝업 WebView (가운데, 90% 크기) */}
      {popupUrl && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            {/* 닫기 버튼 */}
            <Pressable
              style={styles.closeButton}
              onPress={handleClosePopup}
              hitSlop={8}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            <WebView
              source={{ uri: popupUrl }}
              javaScriptEnabled
              domStorageEnabled
              onNavigationStateChange={navState => {
                const url = navState.url;

                // ✅ redirect URI 감지
                if (url.includes('/api/auth/callback')) {
                  const match = url.match(/[?&]code=([^&]+)/);
                  if (match) {
                    const code = decodeURIComponent(match[1]);

                    // ✅ code를 Next.js로 전달
                    mainWebViewRef.current?.injectJavaScript(`
                      window.postMessage(${JSON.stringify(
                        JSON.stringify({ type: 'OAUTH_CODE', code }),
                      )}, "*");
                      true;
                    `);

                    setPopupUrl(null);
                  }
                }
              }}
              onMessage={handleMessage}
              style={styles.popup}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10, // Android 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  popup: {
    flex: 1,
  },
  closeButton: {
    display: 'flex',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 18,
  },
});
