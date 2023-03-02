import { defineStore } from "pinia";
import { cookie } from "@/utils";
import jwtDecode from "jwt-decode";
import { User, SignIn, SignUp } from "@/types/User";
import { signInUser, signUpUser } from "@/services/User";
import router, { RouteNames } from "@/router";
import { toast } from "vue3-toastify";

const useAuth = defineStore("auth", {
  state: () => {
    let authToken = cookie.get("auth_token");

    let user = authToken ? jwtDecode<User>(authToken) : null;

    return {
      user,
    };
  },
  getters: {},
  actions: {
    setUser: function (data: User) {
      this.user = data;
    },
    signIn: async function (data: SignIn) {
      try {
        let {
          data: { token },
        } = await signInUser(data);
        let user = jwtDecode<User>(token);
        this.setUser(user);
        cookie.set({ name: "auth_token", value: token, days: 14 });
        router.push({ name: RouteNames.calendar });
      } catch (err: any) {
        toast.error(err?.message || "Error");
        if (err?.message === "User not exist")
          router.push({ name: RouteNames.signUp });
      }
    },
    signUp: async function (data: SignUp) {
      let {
        data: { token },
      } = await signUpUser(data);
      let user = jwtDecode<User>(token);
      this.setUser(user);
      cookie.set({ name: "auth_token", value: token, days: 14 });
      router.push({ name: RouteNames.calendar });
    },
    logout: function () {
      this.user = null;
      cookie.remove("auth_token");
      router.push("/");
    },
  },
});

export default useAuth;
