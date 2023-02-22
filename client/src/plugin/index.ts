import { App } from "vue";

const plugin = {
  install: (app: App) => {
    console.log("🚀 ~ file: index.ts:8 ~ app:", app);
  },
};

export default plugin;
