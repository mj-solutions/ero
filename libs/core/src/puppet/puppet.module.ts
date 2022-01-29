import { Module } from "@nestjs/common";
import { PuppetService } from "./puppet.service";

@Module({
  providers: [PuppetService],
  exports: [PuppetService],
})
export class PuppetModule {}
