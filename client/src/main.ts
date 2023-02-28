import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import plugin from "./plugin";
import { getMonthName } from "./utils";

import "@/assets/scss/index.scss";

let app = createApp(App);
let pinia = createPinia();

if (document) {
  let date = new Date();

  document.title = `Google Calendar - ${getMonthName(
    date.getMonth()
  )} ${date.getFullYear()}`;

  let favicon = document.head.querySelector<HTMLLinkElement>("[rel='icon']");

  if (favicon) {
    favicon.href = `https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_${date.getDate()}.ico`;
  }
}

app.use(pinia).use(router).use(plugin).mount("#app");
