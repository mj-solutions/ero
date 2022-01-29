import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import { createApp } from "vue";
import App from "./App.vue";
import { vHover } from "./directives/v-hover";
import "./index.css";
import { router } from "./router";

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .directive("hover", vHover);

app.mount("#app");
