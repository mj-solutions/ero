import { PuppetModule, PuppetService } from "@ero/core";
import { Test, TestingModule } from "@nestjs/testing";
import { NetonnetCrawlerService } from "./netonnet-crawler.service";

describe("InetCrawlerService", () => {
  let service: NetonnetCrawlerService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [NetonnetCrawlerService],
      imports: [PuppetModule],
    }).compile();

    service = module.get<NetonnetCrawlerService>(NetonnetCrawlerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("", async () => {
    const puppetService = module.get<PuppetService>(PuppetService);
    puppetService.browser = await puppetService.createBrowser(false);
    const inetCrawler = module.get<NetonnetCrawlerService>(
      NetonnetCrawlerService
    );
    const products = await inetCrawler.crawl();
    console.log(products.length);

    expect(products).toBeDefined();
    await puppetService.browser.close();
  });

  afterEach(async () => {
    await module.close();
  });
});
