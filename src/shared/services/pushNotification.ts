import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';

const TOPIC_LAW_UPDATES = 'law-updates';

/**
 * Android 13+ 알림 권한 요청 및 FCM 토픽 구독
 */
export async function initializePushNotification(): Promise<void> {
  try {
    // Android 13+ (API 33) POST_NOTIFICATIONS 권한 요청
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('[FCM] 알림 권한이 거부되었습니다.');
        return;
      }
    }

    // iOS 권한 요청
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('[FCM] 알림 권한이 거부되었습니다.');
        return;
      }
    }

    // FCM 토큰 확인 (디버깅용)
    const token = await messaging().getToken();
    console.log('[FCM] Device Token:', token);

    // law-updates 토픽 구독 (모든 사용자 자동 구독)
    await messaging().subscribeToTopic(TOPIC_LAW_UPDATES);
    console.log(`[FCM] '${TOPIC_LAW_UPDATES}' 토픽 구독 완료`);
  } catch (error) {
    console.error('[FCM] 초기화 실패:', error);
  }
}

/**
 * Foreground 메시지 수신 리스너 등록
 * @returns unsubscribe 함수
 */
export function onForegroundMessage(): () => void {
  return messaging().onMessage(async remoteMessage => {
    console.log('[FCM] Foreground 메시지 수신:', remoteMessage);

    const title = remoteMessage.notification?.title ?? '알림';
    const body = remoteMessage.notification?.body ?? '';

    Alert.alert(title, body);
  });
}

/**
 * Background/Quit 상태 메시지 핸들러
 * index.js에서 AppRegistry 전에 호출해야 함
 */
export function registerBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[FCM] Background 메시지 수신:', remoteMessage);
  });
}
