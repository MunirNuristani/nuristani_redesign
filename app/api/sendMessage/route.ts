import { emailTemplete } from '@/app/components/EmailTemps/emailtoUser';
import { sendEmail, extractBrevoError } from '@/utils/brevo';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    await sendEmail({
      to: [{ email: body.Email }],
      subject: "Thank you for reaching out to Nuristani.info",
      textContent: body.Message,
      htmlContent: emailTemplete(body),
    });
    return new Response(JSON.stringify("email sent"), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const details = extractBrevoError(err);
    console.error("sendMessage error", details);
    return new Response(JSON.stringify({ error: details }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
