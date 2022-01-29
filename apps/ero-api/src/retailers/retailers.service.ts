import { MongoService } from "@ero/core";
import { Retailer } from "@ero/types";
import { Injectable } from "@nestjs/common";
import { CreateRetailerDto } from "./dto/create-retailer.dto";
import { UpdateRetailerDto } from "./dto/update-retailer.dto";

@Injectable()
export class RetailersService {
  constructor(private readonly mongoService: MongoService) {}

  create(createRetailerDto: CreateRetailerDto) {
    return "This action adds a new retailer";
  }

  findAll() {
    return this.mongoService.find("retailers");
  }

  findOne(id: string) {
    return this.mongoService.findOne<Retailer>("retailers", { id });
  }

  update(id: number, updateRetailerDto: UpdateRetailerDto) {
    return `This action updates a #${id} retailer`;
  }

  remove(id: number) {
    return `This action removes a #${id} retailer`;
  }
}
