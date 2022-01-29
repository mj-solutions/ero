import { Controller, Get, Param } from "@nestjs/common";
import { RetailersService } from "./retailers.service";

@Controller("retailers")
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  @Get()
  findAll() {
    return this.retailersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.retailersService.findOne(id);
  }
}
