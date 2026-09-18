import nodemailer from "nodemailer";


const smtpPort = Number(
  process.env.SMTP_PORT ?? 587,
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  firstName: string,
  token: string,
) {
  const frontendUrl =
    process.env.FRONTEND_URL ??
    "http://localhost:3001";

  const resetUrl =
    `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `"Muyalogy Recruitment" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password",
    text: `
Hello ${firstName},

We received a request to reset your Muyalogy Recruitment account password.

Use the link below to create a new password:

${resetUrl}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Muyalogy Recruitment Team
    `.trim(),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #172b4d;">
        <h2 style="margin-bottom: 8px;">
          Reset Your Password
        </h2>

        <p>
          Hello ${firstName},
        </p>

        <p>
          We received a request to reset your
          Muyalogy Recruitment account password.
        </p>

        <p style="margin: 28px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #12a8df;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This password reset link will expire in
          <strong>30 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <p style="margin-top: 32px;">
          Regards,<br />
          <strong>Muyalogy Recruitment Team</strong>
        </p>
      </div>
    `,
  });
}