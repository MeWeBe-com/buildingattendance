import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qtcbre.app',
  appName: 'CBRM',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
