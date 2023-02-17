import { defineStore } from "pinia";
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
  actions: {},
});

export default useAuth;
