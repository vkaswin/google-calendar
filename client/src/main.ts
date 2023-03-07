import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import router from "./router";
import App from "./App.vue";
import dayjs from "dayjs";

import "vue3-toastify/dist/index.css";
import "@/assets/scss/index.scss";

let app = createApp(App);
let pinia = createPinia();

declare module "vue" {
  interface ComponentCustomProperties {
    $publicPath?: string;
  }
}

let publicPath =
  process.env.NODE_ENV === "production" ? "/google-calendar/" : "/";

if (document) {
  let date = new Date();

  document.title = `Google Calendar - ${dayjs(date).format("MMMM YYYY")}`;

  let favicon = document.head.querySelector<HTMLLinkElement>("[rel='icon']");

  if (favicon) {
    favicon.href = `${publicPath}favicon/${date.getDate()}.ico`;
  }
}

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
