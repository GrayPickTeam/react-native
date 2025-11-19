import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface Props {
  uri: string;
}

/** Next.js → RN 메시지 타입 */
interface WebToAppMessage {
  type: 'OPEN_OAUTH';
  provider: 'kakao' | 'google';
  url: string;
}

/** RN → WebView 메시지 타입 */
interface AppToWebMessage {
  type: 'OAUTH_CODE';
  code: string;
}

const WebviewScreen = ({ uri }: Props) => {
  const webviewRef = useRef<WebView>(null);

  // 🔥 1) WebView → RN 메시지 수신 (with strict types)
  const handleWebMessage = (event: WebViewMessageEvent) => {
    try {
      const data: WebToAppMessage = JSON.parse(event.nativeEvent.data);

      if (data.type === 'OPEN_OAUTH') {
        const { url } = data;

        // 외부 브라우저로 열기
        Linking.openURL(url).catch(() => {
          Alert.alert('오류', 'OAuth 인증 페이지를 열 수 없습니다.');
        });
      }
    } catch (e) {
      console.warn('Invalid message from WebView:', e);
    }
  };

  // 🔥 2) 딥링크 처리 → WebView로 code 전달
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;

      if (url.startsWith('com.graypick://callback')) {
        const match = url.match(/[?&]code=([^&]+)/);

        if (match) {
          const code = decodeURIComponent(match[1]);

          const message: AppToWebMessage = {
            type: 'OAUTH_CODE',
            code,
          };

          // WebView로 메시지 전달
          webviewRef.current?.injectJavaScript(`
            window.postMessage(${JSON.stringify(JSON.stringify(message))});
            true;
          `);
        }
      }
    };

    // cold start
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    // runtime 딥링크
    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleWebMessage}
        style={styles.webview}
      />
    </View>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
