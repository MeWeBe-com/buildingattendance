import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qtcbresentry.app',
  appName: 'Sentry',
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
