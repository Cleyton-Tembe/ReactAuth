import type { Request, Response } from "express";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "../helpers/mailTemplate.ts";
import mailClient from "../config/mailconfig.ts";

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
): Promise<void> => {
  try {
    const response = mailClient
      .sendMail({
        from: "From React Auth Web App",
        to: email,
        subject: "verification email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace(
          "{verificationCode}",
          verificationToken,
        ),
      })
      .then(console.log, console.error);

    console.log("sendVerificationEmail: ", response);
  } catch (error) {
    console.log("sendVerificationEmail: ", error);
  }
};

export const welcomeEmail = async (
  name: string,
  email: string,
): Promise<void> => {
  try {
    const response = mailClient.sendMail({
      from: "From React Auth Web App",
      to: email,
      subject: "Welcome Email",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email: string, url: string) => {
  try {
    console.log("sendPasswordResetEmail url: ", url);
    mailClient.sendMail({
      from: "From React Auth Web App",
      to: email,
      subject: "Password Reset Email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url),
    });

    console.log("email sent to", email);
  } catch (error) {
    console.log("error sending email", error);
    throw new Error(`something went wrong ${error}`);
  }
};

export const sendSuccessResetEmail = async (email: string) => {
  try {
    mailClient.sendMail({
      from: "From React Auth Web App",
      to: email,
      subject: "Password Reset Success Email",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    console.log("sendSuccessResetEmail: ", error);
    throw new Error(`error while sending Reset Email: ${error}`);
  }
};
