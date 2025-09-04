import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.qtcbresentry.app',
  appName: 'Sentry QT',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false,
      resize: KeyboardResize.None
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
