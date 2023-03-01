import axios from "./axios";
import { User } from "./config";
import { SignIn, SignUp, AuthResponse } from "@/types/User";

const signInUser = (data: SignIn) => {
  return axios<AuthResponse>({
    url: User.signIn,
    method: "post",
    data,
  });
};

const signUpUser = (data: SignUp) => {
  return axios<AuthResponse>({
    url: User.signUp,
    method: "post",
    data,
  });
};

export { signInUser, signUpUser };
