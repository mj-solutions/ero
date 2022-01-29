import { MongoModule } from "@ero/core";
import { Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { RetailersModule } from "./retailers/retailers.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ProductsModule, RetailersModule, MongoModule, ConfigModule.forRoot({isGlobal: true})]
})
export class EroApiModule {}
