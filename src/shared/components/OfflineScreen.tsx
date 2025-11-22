import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>인터넷 연결이 없습니다</Text>
      <Text style={styles.desc}>네트워크 상태를 확인해주세요.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  desc: { color: '#666' },
});

export default OfflineScreen;
