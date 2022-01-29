import { MongoService } from "@ero/core";
import { Product, Retailer } from "@ero/types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
  constructor(private readonly mongoService: MongoService) {}

  async findAll() {
    const products = await this.mongoService.find<Product>("products");
    const retailers = await this.mongoService.find<Retailer>("retailers");
    return products.map((product) => {
      const retailer = retailers.find(
        (retailer) => retailer.id === product.retailerId
      );
      return {
        ...product,
        retailer,
      };
    });
  }

  findOne(id: string) {
    return this.mongoService.findOne("products", { id });
  }
}
