const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.MAIL_FROM || "hrms@noreply.com";
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://hrms-app-five.vercel.app";

/**
 * Sends a professional onboarding email to a newly activated employee.
 * The email contains a secure, time-limited link for them to set their password.
 *
 * @param {Object} options
 * @param {string} options.email       - Recipient email address
 * @param {string} options.fullName    - Employee's full name (for personalization)
 * @param {string} options.setupToken  - The one-time setup token stored in DB
 */
async function sendOnboardingEmail({ email, fullName, setupToken }) {
  const setupUrl = `${FRONTEND_URL}/setup-password?token=${setupToken}`;
  const firstName = fullName?.split(" ")[0] || "there";

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to HRMS</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">HRMS Portal</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Human Resource Management System</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#374151;font-size:15px;">Hi <strong>${firstName}</strong>,</p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.7;">
                Your HRMS account has been activated by your organisation's administrator.
                You're all set to get started — click the button below to set your password and log in.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${setupUrl}"
                       style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;
                              font-size:14px;font-weight:600;padding:14px 36px;border-radius:10px;
                              letter-spacing:0.2px;">
                      Set Up My Account →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;color:#374151;font-size:13px;font-weight:600;">⏱ Link expires in 24 hours</p>
                    <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                      For security, this setup link is valid for 24 hours only.
                      If it expires, please contact your HR team to request a new one.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                If the button above doesn't work, copy and paste this URL into your browser:<br/>
                <a href="${setupUrl}" style="color:#4f46e5;word-break:break-all;">${setupUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0;color:#d1d5db;font-size:11px;">
                This email was sent by your organisation's HRMS system. Do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const msg = {
    to: email,
    from: {
      email: FROM_EMAIL,
      name: "HRMS Portal",
    },
    subject: "Your HRMS Account Is Ready — Set Up Your Password",
    text: `Hi ${firstName},\n\nYour HRMS account has been activated. Set your password here:\n${setupUrl}\n\nThis link expires in 24 hours.\n\nHRMS Portal`,
    html: htmlBody,
  };

  console.log(`[EMAIL] Attempting to send to: ${email} | From: ${FROM_EMAIL}`);
  await sgMail.send(msg);
  console.log(`[EMAIL] ✅ SUCCESS — Onboarding email sent to ${email}`);
}

module.exports = { sendOnboardingEmail };
