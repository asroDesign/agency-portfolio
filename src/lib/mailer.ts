import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends transactional emails. Uses SMTP when configured, otherwise logs
 * the email content (useful in demo/local environments without SMTP).
 */
export async function sendMail({ to, subject, html }: MailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "Asro Development Team <no-reply@asro.dev>";

  if (!host || !user || !pass) {
    // No SMTP configured — log for demo purposes.
    console.log(`\n[MAILER] (SMTP not configured — would send to ${to})\nSubject: ${subject}\n${html}\n`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465",
      auth: { user, pass },
    });

    await transporter.sendMail({ from, to, subject, html });
    return true;
  } catch (err) {
    console.error("[MAILER] failed to send email:", err);
    return false;
  }
}

export function purchaseEmailHtml(args: {
  customerName: string;
  templateTitle: string;
  downloadUrl: string;
  addons: { name: string }[];
}): string {
  const addonList = args.addons.length
    ? `<ul>${args.addons.map((a) => `<li>${a.name}</li>`).join("")}</ul>`
    : "<p>بدون ادان</p>";

  return `
    <div dir="rtl" style="font-family: Tahoma, sans-serif; max-width: 560px; margin: auto; padding: 24px; background: #f8fafc; border-radius: 16px;">
      <h2 style="color: #4f46e5; margin: 0 0 16px;">خرید شما با موفقیت انجام شد 🎉</h2>
      <p>${args.customerName} عزیز،</p>
      <p>از خرید شما سپاسگزاریم. اطلاعات قالب و لینک دانلود به شرح زیر است:</p>
      <div style="background: #fff; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>قالب:</strong> ${args.templateTitle}</p>
        <p style="margin: 0 0 16px;"><strong>لینک دانلود:</strong> <a href="${args.downloadUrl}" style="color: #4f46e5;">دانلود قالب</a></p>
        <p style="margin: 0 0 8px;"><strong>ادان‌های خریداری‌شده:</strong></p>
        ${addonList}
      </div>
      <p style="color: #64748b; font-size: 13px;">همچنین می‌توانید از پنل کاربری خود به این اطلاعات و لینک دانلود دسترسی داشته باشید.</p>
    </div>
  `;
}
