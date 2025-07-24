import sgMail from '@sendgrid/mail';
import { emailTemplete } from '@/app/components/EmailTemps/emailtoAdmin';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

  try {
    const msg =  {
      to:"munir1208@gmail.com",
      from: "info@nuristani.info",
      subject: "You got a message on Nuristani.info from " + body.Name,
      text: body.Message,
      html: emailTemplete(body),
    }
    
    sgMail.send(msg).then(() => {
      console.log('Email sent')
    }).catch((error) => {
      console.error("error",error.response.body)
    })
    return new Response(JSON.stringify("email sent"), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
