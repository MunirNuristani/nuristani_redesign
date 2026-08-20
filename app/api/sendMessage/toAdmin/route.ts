import { emailTemplete } from '@/app/components/EmailTemps/emailtoAdmin';
import { sendEmail, extractBrevoError } from '@/utils/brevo';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    await sendEmail({
      to: [{ email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "munir1208@gmail.com" }],
      subject: "You got a message on Nuristani.info from " + body.Name,
      textContent: body.Message,
      htmlContent: emailTemplete(body),
    });
    return new Response(JSON.stringify("email sent"), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const details = extractBrevoError(err);
    console.error("sendMessage/toAdmin error", details);
    return new Response(JSON.stringify({ error: details }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
