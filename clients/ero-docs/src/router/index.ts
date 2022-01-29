import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LandingPage from "../pages/landing-page/LandingPage.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
