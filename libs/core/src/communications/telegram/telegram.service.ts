import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class TelegramService {
  private readonly logger = new Logger("TelegramService");

  private readonly chatIds = [process.env.TELEGRAM_CHAT as string];
  private readonly httpClient: AxiosInstance = axios.create({
    baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}`,
  });

  public getUpdates() {
    return this.httpClient.get("/getUpdates");
  }

  public getMe() {
    return this.httpClient.get("/getMe");
  }

  public sendMessagesToAllChats(message: string) {
    this.logger.log("Sending message to all chats...");
    return Promise.allSettled(
      this.chatIds.map((c) => this.sendMessage(c, message))
    );
  }

  public sendMessage(chatId: string, message: string) {
    return this.httpClient.post("/sendMessage", {
      chat_id: chatId,
      text: message,
    });
  }
}
