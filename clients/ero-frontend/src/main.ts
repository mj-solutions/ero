import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);

app.use(PrimeVue);
app.use(createPinia());

app.component("InputText", InputText);

app.mount("#app");
