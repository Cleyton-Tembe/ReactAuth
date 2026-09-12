import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const mailClient = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.MAIL_PWD,
  },
});

export const verify = async () => {
  try {
    await mailClient.verify();
    console.log("well it works for some reason");
  } catch (error) {
    console.log("H: ", error);
  }
};

export default mailClient;
