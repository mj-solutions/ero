import { MongoService } from "@ero/core";
import { Retailer } from "@ero/types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RetailersService {
  constructor(private readonly mongoService: MongoService) {}

  findAll() {
    return this.mongoService.find("retailers");
  }

  findOne(id: string) {
    return this.mongoService.findOne<Retailer>("retailers", { id });
  }
}
