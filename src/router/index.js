import { createRouter, createWebHistory } from "vue-router";
import beforeEach from "./beforeEach";

import TheContainer from "../components/TheContainer.vue";

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active-link",
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/register",
      name: "cadastro",
      component: () => import("../views/auth/RegisterView.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: TheContainer,
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard", // sem a barra inicial
          name: "AdminDashboard",
          component: () => import("../views/admin/DashboardView.vue"),
        },
        {
          path: "users",
          name: "AdminUsers",
          component: () => import("../views/admin/UsersView.vue"),
        },        {
          path: "carteiras",
          name: "AdminCarteiras",
          component: () => import("../views/admin/CarteirasView.vue"),
        },
        {
          path: "carteiras/:id/dashboard",
          name: "CarteiraDashboard",
          component: () => import("../views/admin/CarteiraDashboard.vue"),
        }
      ],
    },
    {
      path: "/client",
      component: TheContainer,
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard", // sem a barra inicial
          name: "UserDashboard",
          component: () => import("../views/cliente/DashboardView.vue"),
        },
        {
          path: "carteira",
          name: "UserWallet",
          component: () => import("../views/cliente/CarteiraView.vue")
        }
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(beforeEach);

export default router;
