import { PuppetService } from "@ero/core";
import { asyncCall, CARDS_TO_FIND, priceStringToNumber } from "@ero/shared";
import { filterByInclusion } from "@ero/shared/utils/fetch-html";
import { Crawler, ScrapedProduct } from "@ero/types";
import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";

@Injectable()
export class ElgigantenCrawlerService implements Crawler<ScrapedProduct> {
  private acceptedTerms: boolean = false;
  private readonly url =
    "https://www.elgiganten.se/catalog/datorer-tillbehor/datorkomponenter/se-datorkomponenter-grafikkort/grafikkort?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3Dz6qsGQV5mr4AAAFaGaiVoDxV%26discontinued%3D0%26online%3D1%26%40Sort.name%3D0%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=se-datorkomponenter-grafikkort&CategoryDomainName=store-elgigantenSE-ProductCatalog#filter-sidebar";
  public name = "Elgiganten";

  constructor(private readonly puppetService: PuppetService) {}

  async crawl(): Promise<ScrapedProduct[]> {
    const page = await this.puppetService.newPage();

    const [_, html] = await asyncCall(async () => {
      await page.goto(this.url);

      if (!this.acceptedTerms) {
        await page.mouse.move(100, 100);
        await page.waitForSelector(".coi-banner__accept");
        await page.click(".coi-banner__accept");
        this.acceptedTerms = true;
      }

      await this.puppetService.autoScroll(page);
      return page.$eval("body", (el) => el.innerHTML);
    });

    if (!html) {
      await page.close();
      return [];
    }

    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = $(".mini-product-content")
      .map((_, el) => {
        const el$ = $(el);
        const url = el$.find(".product-name").attr("href") as string;
        const price = priceStringToNumber(
          el$.find(".product-price").text().trim()
        );
        const name = el$.find(".product-name").text().trim();
        const content = el$.find(".items-in-stock").text().trim();

        const inStock = el$
          .find(".add-to-basket")
          .text()
          .trim()
          .toLowerCase()
          .includes("kundvagn");
        const splitUrl = url.split("/");
        const id = splitUrl[splitUrl.length - 2];
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

    const wantedProducts = filterByInclusion(products, ["name"], CARDS_TO_FIND);

    await page.close();
    return wantedProducts;
  }
}
