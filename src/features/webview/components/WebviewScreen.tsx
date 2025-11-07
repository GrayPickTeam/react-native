import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  uri: string;
}

const WebviewScreen = ({ uri }: Props) => {
  const webviewRef = useRef<WebView>(null);

  // ✅ 앱이 열릴 때 or 포그라운드 복귀 시 딥링크 처리
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;

      if (url.startsWith('com.graypick://callback')) {
        const match = url.match(/[?&]code=([^&]+)/);
        if (match) {
          const code = decodeURIComponent(match[1]);

          // ✅ code를 웹뷰(Next.js)에 전달
          webviewRef.current?.injectJavaScript(`
            window.postMessage(${JSON.stringify(
              JSON.stringify({ type: 'OAUTH_CODE', code }),
            )}, "*");
            true;
          `);
        }
      }
    };

    // 앱이 새로 실행될 때 들어온 링크
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    // 앱이 이미 열려있을 때 들어오는 링크
    const sub = Linking.addEventListener('url', handleDeepLink);

    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
