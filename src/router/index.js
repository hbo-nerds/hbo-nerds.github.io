import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/over",
      name: "about",
      component: () => import("@/views/About.vue"),
    },
    {
      path: "/series",
      children: [
        { path: "", name: "series", component: () => import("@/views/Series.vue") },
        { path: ":id", name: "serie", component: () => import("@/views/Serie.vue") },
      ],
    },
    {
      path: "/you",
      children: [
        { path: "", name: "you", component: () => import("@/views/You.vue") },
        { path: "history", name: "history", component: () => import("@/views/History.vue") },
        { path: "playlists", name: "playlists", component: () => import("@/views/Playlists.vue") },
        {
          path: "playlists/:title",
          name: "playlist",
          component: () => import("@/views/Playlist.vue"),
        },
        { path: "liked-items", name: "liked-items", component: () => import("@/views/Liked.vue") },
      ],
    },
    {
      path: "/item/:id",
      name: "card",
      component: () => import("@/views/Card.vue"),
    },
    {
      path: "/heatmap",
      name: "heatmap",
      component: () => import("@/views/CalendarHeatmap.vue"),
    },
    {
      path: "/shared-playlist",
      name: "sharedPlaylist",
      component: () => import("@/views/SharedPlaylist.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  const el = document.getElementById("main-content");
  if (el) el.scrollTo({ top: 0, behavior: "instant" });
  next();
});

export default router;
