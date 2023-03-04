import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import { getMonthName } from "./utils";

import "@/assets/scss/index.scss";
import "vue3-toastify/dist/index.css";

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

  document.title = `Google Calendar - ${getMonthName(
    date.getMonth()
  )} ${date.getFullYear()}`;

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
  } as ToastContainerOptions)
  .mount("#app");
