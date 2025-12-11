import e, { text } from "express";
import transporter from "../config/mailtrap.config";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_TEMPLATE,
} from "../templates/emailTemplates";
const sender = '"Care Her" <hello@demomailtrap.co>'
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
            text: "Welcome to Care Her"
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};