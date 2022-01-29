import { PuppetService } from "@ero/core";
import {
  asyncCall,
  CARDS_TO_FIND,
  filterByInclusion,
  priceStringToNumber,
} from "@ero/shared";
import { Crawler, ScrapedProduct } from "@ero/types";
import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";

@Injectable()
export class NetonnetCrawlerService implements Crawler<ScrapedProduct> {
  private readonly url =
    "https://www.netonnet.se/art/datorkomponenter/grafikkort?page=1&pageSize=96&filter=168526591&sortOrder=10&sortBy=1";
  public readonly name = "Netonnet";
  private acceptTerms = true;

  constructor(private readonly puppetService: PuppetService) {}

  async crawl(): Promise<ScrapedProduct[]> {
    const page = await this.puppetService.newPage();

    const [_, html] = await asyncCall(async () => {
      await page.goto(this.url);
      // if (this.acceptTerms) {
      //   await page.waitForSelector(".panel.panel-default");
      //   await page.click("button[data-dismiss=modal]");
      // }
      await this.puppetService.autoScroll(page);
      return page.$eval("body", (el) => el.innerHTML);
    });

    if (!html) {
      await page.close();
      return [];
    }

    const $ = cheerio.load(html);

    const products: ScrapedProduct[] = $("#productList .product")
      .map((_, el) => {
        const el$ = $(el);
        const url = ("https://netonnet.se" +
          el$.find(".shortText a").attr("href")) as string;
        const priceString = el$.find("span.price").text();

        const price = priceString ? priceStringToNumber(priceString) : -1;
        const inStock = Boolean(
          el$.find(".warehouseStockStatusContainer .stockStatusInStock").length
        );
        const linkArr = url?.split("/")?.filter((item) => item);
        // Make the title look nice
        const name = linkArr[linkArr.length - 2]
          ?.split("-")
          ?.map((words) => words[0]?.toUpperCase() + words?.substr(1))
          ?.join(" ");

        const id = linkArr[linkArr.length - 1];
        return {
          url,
          price,
          name,
          inStock,
          productId: id,
          retailerName: this.name,
          dateAdded: Date.now(),
          dateLastInStock: -1,
        };
      })
      .toArray();

    const productsInStock = filterByInclusion(
      products,
      ["name"],
      CARDS_TO_FIND
    );

    await page.close();
    return productsInStock;
  }
}
