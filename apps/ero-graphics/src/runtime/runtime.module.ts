import { Module } from "@nestjs/common";
import { CrawlersModule } from "../crawlers/crawlers.module";
import { RuntimeService } from "./runtime.service";

@Module({
  providers: [RuntimeService],
  imports: [CrawlersModule],
})
export class RuntimeModule {}
