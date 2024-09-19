import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["**/*"],
      devOptions: {
        enabled: true,
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000,
      },
      manifest: {
        name: "Lekker Speuren",
        short_name: "LekkerSpeuren",
        categories: ["entertainment", "games", "video"],
        description:
          "Introducing Lekker Speuren. Een database van ALLE Lekker Spelen content waar je vliegensvlug doorheen kan speuren.",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/ls-home.png",
            sizes: "720x627",
            form_factor: "wide",
            label: "Zoek naar VOD's van de malle makkers.",
          },
          {
            src: "/screenshots/ls-series.png",
            sizes: "720x627",
            form_factor: "wide",
            label: "Bekijk series voor een malle marathon.",
          },
          {
            src: "/screenshots/ls-profile.png",
            sizes: "720x627",
            form_factor: "wide",
            label: "Maak eigen playlists.",
          },
        ],
        shortcuts: [
          {
            name: "Your page",
            description: "Go to your page with history, playlists and liked items.",
            url: "/you",
          },
          {
            name: "Series",
            description: "View all Lekker Speler series.",
            url: "/series",
          },
        ],
        start_url: "/",
        theme_color: "#0f0f0f",
        background_color: "#0f0f0f",
        display: "standalone",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
