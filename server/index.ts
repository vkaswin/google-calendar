import express from "express";
import dotenv from "dotenv";
import cors from "./src/middlewares/cors";
import connect from "./src/database/config";

dotenv.config();

const port = process.env.PORT;
const app = express();

app
  .use(
    cors({
      allowedOrigins:
        process.env.NODE_ENV === "development"
          ? ["http://localhost:3000"]
          : ["https://vkaswin.github.io"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    })
  )
  .use(express.json())
  .use(express.urlencoded({ extended: false }));

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
