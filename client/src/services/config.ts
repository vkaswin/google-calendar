const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://google-calendar-six.vercel.app";

const userUrl = `${baseURL}/api/user`;
const eventUrl = `${baseURL}/api/event`;

const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};

const Event = {
  create: `${eventUrl}/create`,
  getByDate: `${eventUrl}/date`,
  delete: (id: string) => `${eventUrl}/${id}/remove`,
  update: (id: string) => `${eventUrl}/${id}/edit`,
  search: `${eventUrl}/search`,
};

export { User, Event };
