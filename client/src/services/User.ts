import axios from "./axios";
import { SignIn, SignUp, AuthResponse } from "@/types/User";

const signInUser = (data: SignIn) => {
  return axios<AuthResponse>({
    url: "http://localhost:8000/api/user/sign-in",
    method: "post",
    data,
  });
};

const signUpUser = (data: SignUp) => {
  return axios<AuthResponse>({
    url: "http://localhost:8000/api/user/sign-up",
    method: "post",
    data,
  });
};

export { signInUser, signUpUser };
