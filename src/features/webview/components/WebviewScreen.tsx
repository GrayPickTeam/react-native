import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  uri: string;
}

const WebviewScreen = ({ uri }: Props) => {
  return <WebView source={{ uri }} style={styles.webview} domStorageEnabled />;
};

export default WebviewScreen;

const styles = StyleSheet.create({
  webview: { flex: 1 },
});
