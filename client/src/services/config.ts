const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

const userUrl = `${baseURL}/api/user`;
const eventUrl = `${baseURL}/api/event`;

const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

const Event = {
  create: `${eventUrl}/create`,
};

export { User, Event };
