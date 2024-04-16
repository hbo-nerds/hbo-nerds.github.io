import vueDebounce from 'vue-debounce'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyLoad from 'vue3-lazyload'
import VueGtag from "vue-gtag";

import App from './App.vue'
import router from './router'

import "bootstrap"
import "./scss/styles.scss"

const app = createApp(App)

app.use(VueLazyLoad)
app.use(VueGtag, {
    config: { id: 'G-T274C66T0E'}
}, router)
app.directive('debounce', vueDebounce({ lock: true, listenTo: "input", fireonempty: true }))
app.use(createPinia())
app.use(router)

app.mount('#app')
