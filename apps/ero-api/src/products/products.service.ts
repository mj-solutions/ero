import { MongoService } from "@ero/core";
import { Product, Retailer } from "@ero/types";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly mongoService: MongoService) {}
  create(createProductDto: CreateProductDto) {
    return "This action adds a new product";
  }

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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
