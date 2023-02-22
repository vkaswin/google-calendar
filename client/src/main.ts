import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import plugin from "./plugin";

import "@/assets/scss/index.scss";

let app = createApp(App);
let pinia = createPinia();

app.use(pinia).use(router).use(plugin).mount("#app");
