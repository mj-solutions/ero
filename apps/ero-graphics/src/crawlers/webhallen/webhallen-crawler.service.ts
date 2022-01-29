import {
  CARDS_TO_FIND,
  filterByInclusion,
  priceStringToNumber,
} from "@ero/shared";
import { Crawler, ScrapedProduct, WebhallenResponse } from "@ero/types";
import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class WebhallenCrawlerService implements Crawler<ScrapedProduct> {
  public readonly name = "Webhallen";
  private readonly url =
    "https://www.webhallen.com/api/search?query[sortBy]=sales&query[filters][0][type]=category&query[filters][0][value]=4684&query[minPrice]=0&query[maxPrice]=999999&page=1";

  async crawl(): Promise<ScrapedProduct[]> {
    // Fetch data from XHR request
    const { data } = await axios.get<WebhallenResponse>(this.url);
    const { products: WProducts } = data;
    const products: ScrapedProduct[] = WProducts.map((p) => ({
      url: `https://www.webhallen.com/se/product/${p.id}-${p.name
        .trim()
        .replaceAll(" ", "-")}`,
      price: priceStringToNumber(p.price.price),
      name: p.name,
      productId: String(p.id),
      inStock: Boolean(p.stock.web),
      retailerName: this.name,
      dateAdded: Date.now(),
      dateLastInStock: -1,
    }));

    const selectedProducts = filterByInclusion(
      products,
      ["name"],
      CARDS_TO_FIND
    );
    return selectedProducts;
  }
}
