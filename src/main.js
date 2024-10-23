import { createPinia } from "pinia";
import { createApp } from "vue";
import VueGtag from "vue-gtag";
import Vue3Toastify from "vue3-toastify";

import App from "./App.vue";
import router from "./router";

import "bootstrap";
import "vue3-toastify/dist/index.css";
import "./scss/styles.scss";

const app = createApp(App);

app.use(VueGtag, {
  config: { id: import.meta.env.VITE_GA_MEASUREMENT_ID },
});
app.use(Vue3Toastify, {
  theme: "light",
  transition: "slide",
  position: "bottom-left",
  type: "default",
  autoClose: 3000,
  closeButton: false,
  hideProgressBar: true,
  limit: 1,
});
app.use(createPinia());
app.use(router);

app.mount("#app");
