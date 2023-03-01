const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

const userUrl = `${baseURL}/api/user`;

const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

export { User };
