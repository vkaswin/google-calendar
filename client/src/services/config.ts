const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://google-form-two.vercel.app";

const userUrl = `${baseURL}/api/user`;

const User = {
  login: `${userUrl}/login`,
  register: `${userUrl}/register`,
};

export { User };
