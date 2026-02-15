/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerBackgroundHandler} from './src/shared/services/pushNotification';

// Background 메시지 핸들러는 AppRegistry 전에 등록해야 함
registerBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
