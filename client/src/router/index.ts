import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import useAuth from "@/store/useAuth";

const RouteNames = {
  signIn: "signIn",
  signUp: "signUp",
  calendar: "calendar",
  notFound: "not-found",
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: RouteNames.signIn, replace: true },
  },
  {
    path: "/sign-in",
    name: RouteNames.signIn,
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/SignIn.vue"),
  },
  {
    path: "/sign-up",
    name: RouteNames.signUp,
    component: () =>
      import(/* webpackChunkName: "Register" */ "../views/SignUp.vue"),
  },
  {
    path: "/calendar",
    name: RouteNames.calendar,
    component: () =>
      import(/* webpackChunkName: "Calendar" */ "../views/Calendar.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.notFound,
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "../views/NotFound.vue"),
  },
];

let authPages = [RouteNames.signIn, RouteNames.signUp];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach(({ meta: { requireAuth = false } = {}, name }, from) => {
  let { user } = useAuth();

  if (requireAuth && !user) return { name: RouteNames.signIn };

  //   if (name && typeof name === "string" && authPages.includes(name) && user)
  //     return { name: RouteNames.calendar };
});

export { router as default, RouteNames };
