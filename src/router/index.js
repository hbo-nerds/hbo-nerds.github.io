import About from "@/views/About.vue";
import CalendarHeatmap from "@/views/CalendarHeatmap.vue";
import Card from "@/views/Card.vue";
import History from "@/views/History.vue";
import Home from "@/views/Home.vue";
import Liked from "@/views/Liked.vue";
import Playlist from "@/views/Playlist.vue";
import Playlists from "@/views/Playlists.vue";
import Serie from "@/views/Serie.vue";
import Series from "@/views/Series.vue";
import You from "@/views/You.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/over",
      name: "about",
      component: About,
    },
    {
      path: "/series",
      children: [
        { path: "", name: "series", component: Series },
        { path: ":id", name: "serie", component: Serie },
      ],
    },
    {
      path: "/you",
      children: [
        { path: "", name: "you", component: You },
        { path: "history", name: "history", component: History },
        { path: "playlists", name: "playlists", component: Playlists },
        { path: "playlists/:title", name: "playlist", component: Playlist },
        { path: "liked-items", name: "liked-items", component: Liked },
      ],
    },
    {
      path: "/item/:id",
      name: "card",
      component: Card,
    },
    {
      path: "/heatmap",
      name: "heatmap",
      component: CalendarHeatmap,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
