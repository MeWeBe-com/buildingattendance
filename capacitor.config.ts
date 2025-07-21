import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'CBRE',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false
    }
  }
};

export default config;
