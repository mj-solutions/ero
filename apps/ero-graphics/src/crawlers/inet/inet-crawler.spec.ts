import { PuppetModule, PuppetService } from "@ero/core";
import { Test, TestingModule } from "@nestjs/testing";
import { InetCrawlerService } from "./inet-crawler.service";

describe("InetCrawlerService", () => {
  let service: InetCrawlerService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [InetCrawlerService],
      imports: [PuppetModule],
    }).compile();

    service = module.get<InetCrawlerService>(InetCrawlerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("", async () => {
    const puppetService = module.get<PuppetService>(PuppetService);
    puppetService.browser = await puppetService.createBrowser(false);
    const inetCrawler = module.get<InetCrawlerService>(InetCrawlerService);
    const products = await inetCrawler.crawl();
    console.log(products.length);

    expect(products).toBeDefined();
    await puppetService.browser.close();
  });
});
