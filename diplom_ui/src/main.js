import { createMemoryHistory, createRouter } from "vue-router";

import LoginView from "./components/Login.vue";
import ActionTableView from "./components/ActionTable.vue";

import { createApp } from "vue";
import App from "./App.vue";

const routes = [
    { path: "/", component: ActionTableView },
    { path: "/login", component: LoginView },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

createApp(App).use(router).mount("#app");
