import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyLoad from 'vue3-lazyload'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap"
import "./scss/styles.scss"

const app = createApp(App)

app.use(VueLazyLoad)
app.use(createPinia())
app.use(router)

app.mount('#app')
