import e, { text } from "express";
import transporter from "../config/mailtrap.config";
import {
  NOTIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_TEMPLATE,
} from "../templates/emailTemplates";
const sender = '"Care Her" <hello@demomailtrap.co>';
export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      text: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Welcome to Care Her",
      html: WELCOME_TEMPLATE({ userName: name }),
      text: "Welcome to Care Her",
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email: any, resetCode: string) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetCode),
      text: "Password Reset Request",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendUserNotificationEmail = async (
  email: string,
  title: string,
  message: string
) => {
  try {
    await transporter.sendMail({
      from: sender,
      to: email,
      subject: title,
      html: NOTIFICATION_EMAIL_TEMPLATE
        .replace("{title}", title)
        .replace("{message}", message),
      text: message,
    });

    console.log("Notification Email Sent To:", email);
  } catch (error) {
    console.error("Error sending notification email:", error);
    throw new Error("Failed to send notification email");
  }
};
