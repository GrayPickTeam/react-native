import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { useWebViewNavigation } from '../hooks/useWebViewNavigation';
import { useWebViewOAuthBridge } from '../hooks/useWebViewOAuthBridge';

interface Props {
  uri: string;
}

const WebviewScreen = ({ uri }: Props) => {
  const { webviewRef, onNavigationStateChange } = useWebViewNavigation();
  const { onWebMessage } = useWebViewOAuthBridge(webviewRef);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onWebMessage}
        onNavigationStateChange={onNavigationStateChange}
        allowsBackForwardNavigationGestures={true} // iOS swipe-back
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
