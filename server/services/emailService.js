const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password. This link expires in 10 minutes.</p>

      <a href="${resetUrl}"
         style="background:#6366f1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px;">
         Reset Password
      </a>

      <p style="margin-top:16px;color:#64748b;font-size:13px;">
        If you didn't request this, ignore this email.
      </p>
    `,
  });

  console.log('Resend result:', result);
}

module.exports = { sendPasswordResetEmail };