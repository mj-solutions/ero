import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

@Injectable()
export class PuppetService implements OnModuleInit {
  public browser: Browser;
  private readonly logger = new Logger("PuppeteerService");

  public async onModuleInit() {
    this.logger.log("Initializing... creating the browser instance...");
    this.browser = await this.createBrowser();
    this.logger.log("Initializing... chromium launched!");
  }

  public newPage() {
    return this.browser.newPage();
  }

  public async createBrowser(headless = true) {
    return await puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      headless,
    });
  }

  public async autoScroll(page: Page) {
    await page.evaluate(`(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 1300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 250);
      });
    })()`);
  }
}
