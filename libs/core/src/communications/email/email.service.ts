import { Injectable, Logger } from "@nestjs/common";
import { format } from "date-fns";
import { createTransport } from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transport = createTransport({
    host: process.env.EMAIL_HOST,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  private emailAddresses = [process.env.ERROR_LOG_EMAIL_ADDRESS as string];

  public async sendEmailWithAttachment(errorLog: Buffer) {
    this.logger.log("Sending error Email to", this.emailAddresses.join(", "));
    return this.transport.sendMail({
      to: this.emailAddresses,
      subject: `Error log for ${format(new Date(), "dd/MM - yyyy")}`,
      text: "Please see error log appended in email",
      attachments: [
        {
          filename: `${format(new Date(), "dd:MM:yyyy")}.log`,
          content: errorLog,
        },
      ],
      from: "no-reply@eroerrorhandler.com",
    });
  }

  async sendEmail(website: string, text: string) {
    console.log("Sending email to", this.emailAddresses.join(", "));
    return this.transport.sendMail({
      to: this.emailAddresses,
      subject: `New graphics cards at: ${website}`,
      text,
      from: "noreply@graphicscardstockchecker.com",
    });
  }
}
