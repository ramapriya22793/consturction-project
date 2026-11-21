import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

export class EmailService {
  /**
   * Send notification emails regarding project status or inspections
   */
  static async sendProjectNotification(to: string, subject: string, htmlContent: string) {
    if (!env.RESEND_API_KEY || env.RESEND_API_KEY.includes("dummy")) {
      console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
      return { success: true, mock: true };
    }

    try {
      const data = await resend.emails.send({
        from: "Civil Project <notifications@civilproject.com>",
        to: [to],
        subject,
        html: htmlContent,
      });
      return { success: true, data };
    } catch (error) {
      console.error("[Email Error]:", error);
      throw error;
    }
  }
}
