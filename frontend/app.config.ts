import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "PooPals",
  slug: "poopals",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "poopals",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFFAF5",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.poopals.app",
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFFAF5",
    },
    edgeToEdgeEnabled: true,
    package: "com.poopals.app",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-image-picker",
      {
        photosPermission:
          "PooPals needs access to your photos to add toilet pics.",
        cameraPermission: "PooPals needs camera access for poop documentation.",
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "PooPals needs your location to find nearby toilets and track your poop hotspots.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
