export type User = {
  _id: string;
  name: string;
  email: string;
};

export type SignIn = {
  email: string;
  password: string;
};

export type SignUp = {
  name: string;
  confirm: string;
} & SignIn;

export type AuthResponse = {
  token: string;
};
