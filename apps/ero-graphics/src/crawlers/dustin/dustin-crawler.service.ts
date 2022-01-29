import { PuppetService } from "@ero/core";
import { asyncCall, priceStringToNumber } from "@ero/shared";
import { Crawler, ScrapedProduct } from "@ero/types";
import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";

@Injectable()
export class DustinCrawlerService implements Crawler<ScrapedProduct> {
  constructor(private readonly puppetService: PuppetService) {}
  public readonly name = "Dustin";
  private readonly url =
    "https://www.dustinhome.se/sok/grafikkort/hardvara/datorkomponenter/grafikkort/pci-e-nvidia";

  async crawl(): Promise<ScrapedProduct[]> {
    const page = await this.puppetService.newPage();

    const [_, html] = await asyncCall(async () => {
      await page.goto(this.url);
      await page.waitForSelector(".c-filter-products");
      return page.$eval("body", (el) => el.innerHTML);
    });

    if (!html) {
      await page.close();
      return [];
    }
    const $ = cheerio.load(html);

    const products: ScrapedProduct[] = $(".c-filter-products .c-product-card")
      .map((_, el) => {
        const el$ = $(el);
        const url = ("https://www.dustinhome.se" +
          el$
            .find(".c-product-card-title__display-name")
            .attr("href")) as string;
        const price = priceStringToNumber(
          el$.find(".c-product-card-price").text()
        );
        const name = el$.find(".c-product-card-title__display-name").text();
        const content = el$.find(".c-product-card-list").text();
        const splitUrl = url.split("/");
        const id = splitUrl[splitUrl.length - 2];
        const inStock = !!el$.find(
          ".c-availability__icon.c-availability__icon--green"
        ).length;
        return {
          url,
          price,
          name,
          content,
          productId: id,
          inStock,
          retailerName: this.name,
          dateAdded: Date.now(),
          dateLastInStock: -1,
        };
      })
      .toArray();

    await page.close();
    return products;
  }
}
