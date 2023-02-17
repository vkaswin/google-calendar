import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import useAuth from "@/store/useAuth";

const RouteNames = {
  login: "login",
  register: "register",
  calender: "calender",
  notFound: "not-found",
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: RouteNames.calender, replace: true },
  },
  {
    path: "/auth",
    component: () => import(`../layouts/AuthLayout.vue`),
    children: [
      {
        path: "login",
        name: RouteNames.login,
        component: () => import(`../pages/Login.vue`),
      },
      {
        path: "register",
        name: RouteNames.register,
        component: () => import(`../pages/Register.vue`),
      },
    ],
  },
  {
    path: "/calender",
    name: RouteNames.calender,
    meta: {
      requireAuth: false,
    },
    component: () => import(`../pages/Calender.vue`),
  },
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.notFound,
    component: () => import("../pages/NotFound.vue"),
  },
];

let authPages = [RouteNames.login, RouteNames.register];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach(({ meta: { requireAuth = false } = {}, name }, from) => {
  const { user } = useAuth();

  if (requireAuth && !user) return { name: RouteNames.login };

  if (name && typeof name === "string" && authPages.includes(name) && user)
    return { path: "/" };
});

export { router as default, RouteNames };
