import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "./style.css";

let app = createApp(App);

app.use(createPinia()).use(router).mount("#app");
