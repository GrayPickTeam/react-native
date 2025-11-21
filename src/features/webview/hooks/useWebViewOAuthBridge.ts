import { useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import type WebView from 'react-native-webview';

/** Next.js → RN */
interface WebToAppMessage {
  type: 'OPEN_OAUTH';
  provider: 'kakao' | 'google';
  url: string;
}

/** RN → WebView */
interface AppToWebMessage {
  type: 'OAUTH_CODE';
  code: string;
}

export const useWebViewOAuthBridge = (
  webviewRef: React.RefObject<WebView | null>,
) => {
  /** WebView → RN */
  const onWebMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data: WebToAppMessage = JSON.parse(event.nativeEvent.data);

      if (data.type === 'OPEN_OAUTH') {
        Linking.openURL(data.url).catch(() => {
          Alert.alert('오류', 'OAuth 인증 페이지를 열 수 없습니다.');
        });
      }
    } catch (e) {
      console.warn('Invalid message from WebView:', e);
    }
  }, []);

  /** 딥링크 → WebView */
  const sendCodeToWeb = useCallback(
    (code: string) => {
      const message: AppToWebMessage = {
        type: 'OAUTH_CODE',
        code,
      };

      webviewRef.current?.injectJavaScript(`
      window.postMessage(${JSON.stringify(JSON.stringify(message))});
      true;
    `);
    },
    [webviewRef],
  );

  // 딥링크 핸들링
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;

      if (url.startsWith('com.graypick://callback')) {
        const match = url.match(/[?&]code=([^&]+)/);
        if (match) sendCodeToWeb(decodeURIComponent(match[1]));
      }
    };

    // cold start
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    // runtime
    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, [sendCodeToWeb]);

  return { onWebMessage };
};
