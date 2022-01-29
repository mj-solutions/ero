import { PuppetService } from "@ero/core";
import { asyncCall, priceStringToNumber } from "@ero/shared";
import { Crawler, ScrapedProduct } from "@ero/types";
import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";

@Injectable()
export class KomplettCrawlerService implements Crawler<ScrapedProduct> {
  private readonly url =
    "https://www.komplett.se/category/10412/datorutrustning/datorkomponenter/grafikkort?nlevel=10000%C2%A728003%C2%A710412&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203060&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203060%20Ti&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203070&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203080&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203090&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203070%20Ti&stockStatus=InStock&hits=48&cnet=Grafikprocessor_A00247%20%20%C2%A7NVIDIA%20GeForce%20RTX%203080%20Ti";

  public readonly name = "Komplett";

  constructor(private readonly puppetService: PuppetService) {}

  async crawl(): Promise<ScrapedProduct[]> {
    const page = await this.puppetService.newPage();
    const [_, html] = await asyncCall(async () => {
      await page.goto(this.url);
      await this.puppetService.autoScroll(page);
      return page.$eval("body", (el) => el.innerHTML);
    });

    if (!html) {
      await page.close();
      return [];
    }

    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = $(".product-list  .product-list-item")
      .map((_, el) => {
        const el$ = $(el);
        const url = ("https://www.komplett.se" +
          el$.find(".product-link").attr("href")) as string;
        const priceString = el$.find(".product-price").text().trim();

        const price = priceString ? priceStringToNumber(priceString) : -1;
        const name = el$.find(".text-content").text().trim();
        const inStock = Boolean(
          el$.find(".btn-small.primary.background-transition").length
        );
        const linkArr = url.split("/");
        const idIdx = linkArr.indexOf("product") + 1;
        const id = linkArr[idIdx];
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
    await page.close();
    return products;
  }
}
