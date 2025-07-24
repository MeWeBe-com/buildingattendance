import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cbrm.app',
  appName: 'CBRM',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false
    }
  }
};

export default config;
