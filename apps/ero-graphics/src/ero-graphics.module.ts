import { MongoModule } from "@ero/core";
import { Module } from "@nestjs/common";
import { RuntimeModule } from "./runtime/runtime.module";

@Module({
  imports: [MongoModule, RuntimeModule],
})
export class EroGraphicsModule {}
