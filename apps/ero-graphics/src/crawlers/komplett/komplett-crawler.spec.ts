import { PuppetModule, PuppetService } from "@ero/core";
import { Test, TestingModule } from "@nestjs/testing";
import { KomplettCrawlerService } from "./komplett-crawler.service";

describe("InetCrawlerService", () => {
  let service: KomplettCrawlerService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [KomplettCrawlerService],
      imports: [PuppetModule],
    }).compile();

    service = module.get<KomplettCrawlerService>(KomplettCrawlerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("", async () => {
    const puppetService = module.get<PuppetService>(PuppetService);
    puppetService.browser = await puppetService.createBrowser(false);
    const inetCrawler = module.get<KomplettCrawlerService>(
      KomplettCrawlerService
    );
    const products = await inetCrawler.crawl();
    console.log(products.length);

    expect(products).toBeDefined();
    await puppetService.browser.close();
  });
});
