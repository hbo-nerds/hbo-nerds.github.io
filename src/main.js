import { createPinia } from "pinia";
import { createApp } from "vue";
import vueDebounce from "vue-debounce";
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
app.directive("debounce", vueDebounce({ lock: true, listenTo: "input", fireonempty: true }));
app.use(createPinia());
app.use(router);

app.mount("#app");
