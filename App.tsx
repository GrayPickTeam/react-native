import React from 'react';
import StatusBarWrapper from './src/shared/components/StatusWrapper';
import HomeScreen from './src/features/webview/components/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useIsOnline from './src/shared/hooks/useIsOnline';
import OfflineScreen from './src/shared/components/OfflineScreen';

const App = () => {
  const { isConnected } = useIsOnline();
  return (
    <SafeAreaProvider>
      <StatusBarWrapper>
        {isConnected ? <HomeScreen /> : <OfflineScreen />}
      </StatusBarWrapper>
    </SafeAreaProvider>
  );
};

export default App;
