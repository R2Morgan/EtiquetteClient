import type { CapacitorConfig } from '@capacitor/cli';
import {StatusBar} from "@capacitor/status-bar";

const config: CapacitorConfig = {
  appId: 'com.stefan.etiquette',
  appName: 'Etiquette',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false,
      backgroundColor: '#fbeac9',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;

