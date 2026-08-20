import axios from "axios";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export const EMAIL_FROM = { email: "info@nuristani.info", name: "Nuristani Cultural Foundation" };

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail(params: SendEmailParams) {
  return axios.post(
    BREVO_ENDPOINT,
    { sender: EMAIL_FROM, ...params },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY || "",
        "content-type": "application/json",
        accept: "application/json",
      },
    }
  );
}

export function extractBrevoError(err: unknown) {
  if (axios.isAxiosError(err)) return err.response?.data ?? err.message;
  return err instanceof Error ? err.message : err;
}
