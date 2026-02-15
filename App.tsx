import React, {useEffect} from 'react';
import StatusBarWrapper from './src/shared/components/StatusWrapper';
import HomeScreen from './src/features/webview/components/HomeScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import useIsOnline from './src/shared/hooks/useIsOnline';
import OfflineScreen from './src/shared/components/OfflineScreen';
import {
  initializePushNotification,
  onForegroundMessage,
} from './src/shared/services/pushNotification';

const App = () => {
  const {isConnected} = useIsOnline();

  useEffect(() => {
    initializePushNotification();
    const unsubscribe = onForegroundMessage();
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBarWrapper>
        {isConnected ? <HomeScreen /> : <OfflineScreen />}
      </StatusBarWrapper>
    </SafeAreaProvider>
  );
};

export default App;
