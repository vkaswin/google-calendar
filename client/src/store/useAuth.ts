import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { cookie } from "@/utils";
import jwtDecode from "jwt-decode";
import { User } from "@/types/user";

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
    logout: function () {
      let router = useRouter();
      this.user = null;
      cookie.remove("auth_token");
      router.push("/");
    },
  },
});

export default useAuth;
