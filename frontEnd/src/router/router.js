import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import('@/views/LoginView.vue'),
    meta: { bypassApp: true },
  },
  {
    path: "/",
    name: "Home",
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: "/about",
    name: "About",
    component: () => import('@/views/AboutView.vue'),
  }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  next();
});

// export the router
export default router;