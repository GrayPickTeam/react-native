import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebviewScreen from '../components/WebviewScreen';
import { DEV_SOURCE_URL } from '../../../shared/const/urls';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <WebviewScreen uri={DEV_SOURCE_URL} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default HomeScreen;
