import emailjs from "@emailjs/browser";

// Function to send email
export const sendVerificationEmail = (
  email: string,
  username: string,
  token: string,
  alertCallback: Function | null
) => {
  emailjs
    .send(
      process.env.NEXT_PUBLIC_EMAIL_AUTH_SERVICE_KEY!, // Service ID
      process.env.NEXT_PUBLIC_EMAIL_AUTH_TEMPLATE_KEY!, // Template ID
      {
        email: email,
        username: username,
        token:
          process.env.NEXT_PUBLIC_BASE_URL! + "verify-email?token=" + token, // Template parameters
      },
      process.env.NEXT_PUBLIC_EMAIL_AUTH_PUBLIC_KEY! // Public key
    )
    .then(
      () => {
        if (alertCallback) {
          alertCallback(true);
        }
      },
      (error) => {
        console.log(error);
        if (alertCallback) {
          alertCallback(false);
        }
      }
    );
};
