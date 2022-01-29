import { PuppetService } from "@ero/core";
import { asyncCall, CARDS_TO_FIND, priceStringToNumber } from "@ero/shared";
import { filterByInclusion } from "@ero/shared/utils/fetch-html";
import { Crawler, ScrapedProduct } from "@ero/types";
import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";

@Injectable()
export class InetCrawlerService implements Crawler<ScrapedProduct> {
  private readonly url =
    "https://www.inet.se/kategori/167/geforce-gtx-rtx?filters=%7B%2229%22%3A%7B%22type%22%3A%22PropAny%22%2C%22any%22%3A%5B14296%2C15734%2C14294%2C14297%2C14700%2C14764%5D%7D%2C%2230%22%3A%7B%22type%22%3A%22PropAny%22%2C%22any%22%3A%5B20%5D%7D%7D";

  public readonly name = "Inet";

  constructor(private readonly puppetService: PuppetService) {}

  async crawl(): Promise<ScrapedProduct[]> {
    const page = await this.puppetService.newPage();

    const [, html] = await asyncCall(async () => {
      await page.goto(this.url);
      await this.puppetService.autoScroll(page);
      if (await page.$(".btn-show-more")) {
        await page.click(".btn-show-more");
        await this.puppetService.autoScroll(page);
      }
      return page.$eval("body", (el) => el.innerHTML);
    });

    if (!html) {
      await page.close();
      return [];
    }

    const $ = cheerio.load(html);

    const products: ScrapedProduct[] = $(".product-list ul li")
      .map((_, el) => {
        const el$ = $(el);
        const href = el$.find(".product-text a").attr("href") as string;
        const url = "https://inet.se" + href;
        const id = href.split("/")[2];
        const price = priceStringToNumber(el$.find("span.price").text());
        const name = el$.find(".product-text a").text();
        const inStock = !Boolean(
          el$.find(".btn.btn-buy.buy.blocked.disabled").length
        );
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
    await page.close();
    return filterByInclusion(products, ["name"], CARDS_TO_FIND);
  }
}
