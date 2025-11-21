import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

export const useWebViewNavigation = () => {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // WebView 내비게이션 상태 변화 감지
  const onNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  // 안드로이드 물리 뒤로가기 처리 (ios는 뒤로가기 버튼 없음)
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [canGoBack]);

  return {
    webviewRef,
    onNavigationStateChange,
  };
};
