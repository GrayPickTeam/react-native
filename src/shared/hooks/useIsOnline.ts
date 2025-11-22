import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const useIsOnline = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(Boolean(state.isConnected));
    });
    return () => unsubscribe();
  }, []);

  return { isConnected };
};

export default useIsOnline;
