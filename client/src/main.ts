import { createApp } from "vue";
import { createPinia } from "pinia";
import dayjs from "dayjs";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import router from "./router";
import App from "./App.vue";

import "vue3-toastify/dist/index.css";
import "@/assets/scss/index.scss";

let app = createApp(App);
let pinia = createPinia();

let publicPath =
  process.env.NODE_ENV === "production" ? "/google-calendar/" : "/";

document.title = `Google Calendar - ${dayjs().format("MMMM YYYY")}`;

let favicon = document.head.querySelector("[rel='icon']") as HTMLLinkElement;

favicon.href = `${publicPath}favicon/${dayjs().get("date")}.ico`;

app.config.globalProperties.$publicPath = publicPath;

app
  .use(pinia)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 3000,
    closeButton: true,
    pauseOnFocusLoss: false,
  } as ToastContainerOptions)
  .mount("#app");
