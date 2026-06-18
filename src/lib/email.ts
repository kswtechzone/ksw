import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendVerificationCode(
  email: string,
  code: string,
  username: string
): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('SMTP not configured, verification code not sent')
    return false;
  }

  const from = process.env.SMTP_FROM || 'KSW TechZone <noreply@kswtechzone.com>';

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Admin Login Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #333;">Admin Verification</h2>
          <p style="color: #555;">Hi <strong>${username}</strong>,</p>
          <p style="color: #555;">Use the code below to complete your login:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1; background: #f0f0ff; padding: 12px 24px; border-radius: 8px;">
              ${code}
            </span>
          </div>
          <p style="color: #888; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="color: #aaa; font-size: 12px;">KSW TechZone &mdash; Admin Portal</p>
        </div>
      `,
    });

    console.log('Verification code sent to', email)
    return true;
  } catch (error) {
    console.error('Failed to send verification code:', error)
    return false;
  }
}

export async function sendContactNotification(
  contact: { name: string; email: string; service?: string | null; message: string }
): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('SMTP not configured, contact notification not sent')
    return false;
  }

  const from = process.env.SMTP_FROM || 'KSW TechZone <noreply@kswtechzone.com>';
  const adminEmail = process.env.ADMIN_EMAIL || 'er.sanjayks@gmail.com';

  try {
    await transporter.sendMail({
      from,
      to: adminEmail,
      replyTo: contact.email,
      subject: `New Contact Form Submission — ${contact.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 80px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111827;">${contact.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #6366f1;">
                  <a href="mailto:${contact.email}" style="color: #6366f1; text-decoration: none;">${contact.email}</a>
                </td>
              </tr>
              ${contact.service ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Service</td>
                <td style="padding: 8px 0; color: #111827;">${contact.service}</td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message</p>
              <p style="color: #111827; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${contact.message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              View in admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/contacts" style="color: #6366f1;">Contacts Dashboard</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log('Contact notification sent for', contact.name)
    return true;
  } catch (error) {
    console.error('Failed to send contact notification:', error)
    return false;
  }
}
