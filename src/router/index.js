import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SingleView from "@/views/SingleView.vue";
import SeriesView from "@/views/SeriesView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/series',
      name: 'series',
      component: SeriesView
    },
    {
      path: '/item/:id',
      name: 'single',
      component: SingleView
    }
  ]
})

export default router
