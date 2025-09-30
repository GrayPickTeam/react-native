import React from 'react';
import StatusBarWrapper from './src/shared/components/StatusWrapper';
import HomeScreen from './src/features/webview/components/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBarWrapper>
        <HomeScreen />
      </StatusBarWrapper>
    </SafeAreaProvider>
  );
};

export default App;
