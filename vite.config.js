import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
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
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/ls-home.png",
            sizes: "654x564",
            label: "Zoek naar VOD's van de malle makkers.",
          },
          {
            src: "/screenshots/ls-series.png",
            sizes: "654x564",
            form_factor: "wide",
            label: "Bekijk series voor een marathon.",
          },
          {
            src: "/screenshots/ls-profile.png",
            sizes: "654x564",
            form_factor: "wide",
            label: "Maak eigen playlists.",
          },
        ],
        shortcuts: [
          {
            name: "Your page",
            description: "Go to your page with history, playlists and liked items.",
            url: "/you",
            icons: [
              {
                src: "/shortcut_you.png",
                sizes: "96x96",
                type: "image/png",
              },
            ],
          },
          {
            name: "Series",
            description: "View all Lekker Speler series.",
            url: "/series",
            icons: [
              {
                src: "/shortcut_series.png",
                sizes: "96x96",
                type: "image/png",
              },
            ],
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
