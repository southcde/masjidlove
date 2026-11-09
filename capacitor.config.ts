import type { CapacitorConfig } from "@capacitor/cli";

// Native shell for the static export in /out (npm run build:native).
// The bundle ID can't change after a store release, so confirm it first.
const config: CapacitorConfig = {
  appId: "com.masjidlove.app",
  appName: "MasjidLove",
  webDir: "out",
  android: {
    // Serve the bundled files over https://localhost so web APIs that need a
    // secure context (geolocation, service-free crypto) behave like the PWA.
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      // We hide it ourselves once the first screen has rendered.
      launchAutoHide: false,
      backgroundColor: "#0b3a22",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#ffffff",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
