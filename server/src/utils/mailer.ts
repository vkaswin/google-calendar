import { SendMailOptions, createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let email = process.env.EMAIL_USER;
let password = process.env.EMAIL_PASSWORD;
let service = process.env.EMAIL_SERVICE;

let transporter = createTransport({
  service,
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: password,
  },
});

let mailer = async (mailOptions: Omit<SendMailOptions, "from">) => {
  if (process.env.NODE_ENV !== "development") return;

  try {
    await transporter.sendMail({
      from: email,
      ...mailOptions,
    });
  } catch (err) {
    console.log(err);
  }
};

export default mailer;
