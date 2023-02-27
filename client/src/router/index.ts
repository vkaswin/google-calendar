import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import useAuth from "@/store/useAuth";

const RouteNames = {
  login: "login",
  register: "register",
  calendar: "calendar",
  notFound: "not-found",
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: RouteNames.calendar, replace: true },
  },
  {
    path: "/auth",
    component: () => import(/* webpackChunkName: "AuthLayout" */"../layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: RouteNames.login,
        component: () => import(/* webpackChunkName: "Login" */"../views/Login.vue"),
      },
      {
        path: "register",
        name: RouteNames.register,
        component: () => import(/* webpackChunkName: "Register" */"../views/Register.vue"),
      },
    ],
  },
  {
    path: "/calendar",
    name: RouteNames.calendar,
    component: () => import(/* webpackChunkName: "Calendar" */"../views/Calendar.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.notFound,
    component: () => import(/* webpackChunkName: "NotFound" */"../views/NotFound.vue"),
  },
];

let authPages = [RouteNames.login, RouteNames.register];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach(({ meta: { requireAuth = false } = {}, name }, from) => {
  let { user } = useAuth();

  if (requireAuth && !user) return { name: RouteNames.login };

  if (name && typeof name === "string" && authPages.includes(name) && user)
    return { path: "/" };
});

export { router as default, RouteNames };
