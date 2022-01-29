import { Module } from "@nestjs/common";
import { EmailService } from "./email/email.service";
import { TelegramService } from "./telegram/telegram.service";

@Module({
  providers: [EmailService, TelegramService],
  exports: [EmailService, TelegramService],
})
export class CommunicationsModule {}
