import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SeriesView from "@/views/SeriesView.vue";
import SingleItemView from "@/views/SingleItemView.vue";
import SingleSeriesView from "@/views/SingleSeriesView.vue";
import YouView from "@/views/YouView.vue";
import SinglePlaylistView from "@/views/SinglePlaylistView.vue";
import YouPlaylists from "@/views/YouPlaylists.vue";
import ToolView from "@/views/ToolView.vue";
import YouHistory from "@/views/YouHistory.vue";
import YouLiked from "@/views/YouLiked.vue";
import AboutView from "@/views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/over',
      name: 'about',
      component: AboutView
    },
    {
      path: '/series',
      children: [
        { path: '', name: 'series', component: SeriesView },
        { path: ':id', name: 'single-serie', component: SingleSeriesView },
      ]
    },
    {
      path: '/you',
      children: [
        { path: '', name: 'you', component: YouView},
        { path: 'history', name: 'history', component: YouHistory},
        { path: 'playlists', name: 'playlists', component: YouPlaylists},
        { path: 'playlists/:title', name: 'single-playlist', component: SinglePlaylistView},
        { path: 'liked-items', name: 'liked-items', component: YouLiked},
      ]
    },
    {
      path: '/item/:id',
      name: 'single-item',
      component: SingleItemView
    },
    {
      path: '/upload-tool',
      name: 'upload-tool',
      component: ToolView
    },
    { path: "/:pathMatch(.*)*", redirect: '/' }
  ]
})

export default router
