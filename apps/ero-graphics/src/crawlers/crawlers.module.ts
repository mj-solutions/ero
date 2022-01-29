import { PuppetModule } from "@ero/core";
import { GRAPHICS_CARDS_CRAWLERS } from "@ero/shared";
import { Module } from "@nestjs/common";
import { DustinCrawlerService } from "./dustin/dustin-crawler.service";
import { ElgigantenCrawlerService } from "./elgiganten/elgiganten-crawler.service";
import { InetCrawlerService } from "./inet/inet-crawler.service";
import { KomplettCrawlerService } from "./komplett/komplett-crawler.service";
import { NetonnetCrawlerService } from "./netonnet/netonnet-crawler.service";
import { ProshopCrawlerService } from "./proshop/proshop-crawler.service";
import { WebhallenCrawlerService } from "./webhallen/webhallen-crawler.service";

@Module({
  providers: [
    DustinCrawlerService,
    InetCrawlerService,
    KomplettCrawlerService,
    NetonnetCrawlerService,
    ProshopCrawlerService,
    WebhallenCrawlerService,
    ElgigantenCrawlerService,
    {
      provide: GRAPHICS_CARDS_CRAWLERS,
      useFactory: (...services) => [...services],
      inject: [
        DustinCrawlerService,
        InetCrawlerService,
        KomplettCrawlerService,
        NetonnetCrawlerService,
        ProshopCrawlerService,
        WebhallenCrawlerService,
        ElgigantenCrawlerService,
      ],
    },
  ],
  exports: [GRAPHICS_CARDS_CRAWLERS],
  imports: [PuppetModule],
})
export class CrawlersModule {}
