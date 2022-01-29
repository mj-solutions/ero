import { PuppetService } from "@ero/core";
import { asyncCall, priceStringToNumber } from "@ero/shared";
import { Crawler, ScrapedProduct } from "@ero/types";
import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";

@Injectable()
export class ProshopCrawlerService implements Crawler<ScrapedProduct> {
  private readonly url =
    "https://www.proshop.se/Grafikkort?inv=1&pre=0&f~grafikkort_videoudganggrafikprocessorleverandor=nvidia-geforce-rtx-2060~nvidia-geforce-rtx-3060~nvidia-geforce-rtx-3060-ti~nvidia-geforce-rtx-3080-ti~nvidia-geforce-rtx-3090";
  constructor(private readonly puppetService: PuppetService) {}
  public readonly name = "Proshop";

  async crawl(): Promise<ScrapedProduct[]> {
    const page = await this.puppetService.newPage();

    const [_, html] = await asyncCall(async () => {
      await page.goto(this.url);
      await page.waitForSelector("#products");
      return page.$eval("body", (el) => el.innerHTML);
    });

    if (!html) {
      await page.close();
      return [];
    }

    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = $("#products  li")
      .map((_, el) => {
        const el$ = $(el);
        const href = el$.find(".site-product-link").attr("href");
        const url = "https://proshop.se" + href;
        const id = href?.split("/").pop() as string;
        const price = priceStringToNumber(
          el$.find(".site-currency-lg").text().trim()
        );
        const name = el$.find("h2[product-display-name]").text().trim();
        const inStock =
          el$.find("button").text().trim().toLowerCase() === "köp";
        return {
          url,
          price,
          name,
          productId: id,
          inStock,
          retailerName: this.name,
          dateAdded: Date.now(),
          dateLastInStock: -1,
        };
      })
      .toArray();

    const newProductsInStock = products.filter(
      (p) => !p.name?.toLowerCase().trim().includes("bundle")
    );
    await page.close();
    return newProductsInStock;
  }
}
