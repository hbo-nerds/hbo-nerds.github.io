import { createPinia } from "pinia";
import { createApp } from "vue";
import VueGtag from "vue-gtag";

import App from "./App.vue";
import router from "./router";

import "bootstrap";
import "./scss/styles.scss";

const app = createApp(App);

app.use(
  VueGtag,
  {
    config: { id: import.meta.env.VITE_GA_MEASUREMENT_ID },
  },
  router,
);
app.use(createPinia());
app.use(router);

app.mount("#app");
