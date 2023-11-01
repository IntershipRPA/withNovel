import { createApp } from "vue";
import "./styles/index.css";
import "./styles/tailwind.css";
import "./styles/Prosemirror.css";
import App from "./App.vue";
import { createPinia } from 'pinia';

const pinia = createPinia(); // Pinia 스토어를 생성

createApp(App).use(pinia).mount("#app");