import { MongoService } from "@ero/core";
import {
  GRAPHICS_CARDS_CRAWLERS,
  notEmpty,
  UPDATE_INTERVAL_MIN,
} from "@ero/shared";
import {
  Crawler,
  Document,
  Product,
  Retailer,
  ScrapedProduct,
} from "@ero/types";
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import fastDeepEqual from "fast-deep-equal";
import { interval, Subject, Subscription, zip } from "rxjs";

@Injectable()
export class RuntimeService implements OnModuleInit, OnModuleDestroy {
  private timer = interval(UPDATE_INTERVAL_MIN * 60 * 1000);
  private graphicsCardsFinished$ = new Subject<void>();
  private logger = new Logger(RuntimeService.name);
  private subscription: Subscription;
  private retailers: Document<Retailer>[] = [];
  private products: Document<Product>[] = [];
  private productsToCreate: ScrapedProduct[] = [];
  private productsToUpdate: Document<Product>[] = [];
  private shouldUpdateCache = false;

  constructor(
    @Inject(GRAPHICS_CARDS_CRAWLERS)
    private readonly crawlers: Crawler<ScrapedProduct>[],
    private readonly mongoService: MongoService
  ) {}

  public async onModuleInit() {
    this.products = await this.mongoService.find("products");
    this.retailers = await this.mongoService.find("retailers");

    this.subscription = zip(this.timer, this.graphicsCardsFinished$).subscribe(
      () => this.crawlAndNotify()
    );
    this.crawlAndNotify();
  }

  private async crawlAndNotify() {
    this.logger.log("All crawlers start to crawl the web...");
    await this.crawlWithAllCrawlers();

    if (this.productsToCreate.length) {
      this.logger.log("New cards were found. Populating mongoDB");
      const products: Product[] = this.productsToCreate
        .map((toCreate) => {
          const retailer = this.retailers.find(
            (retailer) => retailer.name === toCreate.retailerName
          );
          if (!retailer) return;
          const product: Product = {
            inStock: toCreate.inStock,
            name: toCreate.name,
            price: toCreate.price,
            productId: toCreate.productId,
            retailerId: retailer.id,
            url: toCreate.url,
            dateAdded: toCreate.dateAdded,
            dateLastInStock: -1
          };
          return product;
        })
        .filter(notEmpty);
      await this.mongoService.insertMany("products", ...products);
      this.logger.log(`Created ${products.length} products`);
      this.productsToCreate = [];
      this.shouldUpdateCache = true;
    }

    if (this.productsToUpdate.length) {
      this.logger.log("Cards had an update. Updating MongoDB.");
      await this.mongoService.updateMany("products", ...this.productsToUpdate);
      this.logger.log(`Updated ${this.productsToUpdate.length} products`);
      this.productsToUpdate = [];
      this.shouldUpdateCache = true;
    }
    if (this.shouldUpdateCache) {
      this.logger.log("Local cache and cloud differs. Fetching latest");
      this.products = await this.mongoService.find("products");
      this.shouldUpdateCache = false;
    }

    this.graphicsCardsFinished$.next();
  }

  private crawlWithAllCrawlers() {
    return Promise.allSettled(
      this.crawlers.map(async (crawler) => {
        const result = await crawler.crawl();
        this.logger.log(
          `${crawler.name} finished crawling and found ${result.length} products`
        );
        return this.handleCrawlSuccess(result);
      })
    );
  }

  private handleCrawlSuccess(products: ScrapedProduct[]) {
    return Promise.all(
      products.map((product) => this.handleProductInsert(product))
    );
  }

  private async handleProductInsert(scrapedProduct: ScrapedProduct) {
    const existingProduct = this.products.find(
      (product) => product.productId === scrapedProduct.productId
    );

    if (!existingProduct) {
      scrapedProduct.dateLastInStock = scrapedProduct.inStock ? Date.now() : -1;
      this.productsToCreate.push(scrapedProduct);
      return;
    }

    const newProduct = {
      price: scrapedProduct.price,
      name: scrapedProduct.name,
      inStock: scrapedProduct.inStock,
      url: scrapedProduct.url,
    };
    const mappedExistingProduct = {
      price: existingProduct.price,
      name: existingProduct.name,
      inStock: existingProduct.inStock,
      url: existingProduct.url,
    };

    if (fastDeepEqual(newProduct, mappedExistingProduct)) {
      this.logger.log("Old product was the same returning.");
      return;
    }

    const keys = Object.keys(newProduct) as Array<keyof typeof newProduct>;
    for (const key of keys) {
      if (existingProduct[key] !== newProduct[key]) {
        (existingProduct[key] as any) = newProduct[key];
      }
    }
    if (existingProduct.inStock)
      existingProduct.dateLastInStock = Date.now();
    this.productsToUpdate.push(existingProduct);
    this.logger.log("Added product that needs to be updated!");
  }

  public onModuleDestroy() {
    this.subscription.unsubscribe();
  }
}
