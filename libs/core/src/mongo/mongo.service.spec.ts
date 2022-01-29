import { Test, TestingModule } from "@nestjs/testing";
import { MongoService } from "./mongo.service";

describe("MongoService", () => {
  let service: MongoService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [MongoService],
    }).compile();
    await module.init();
    service = module.get<MongoService>(MongoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("Should be able to make queries", async () => {
    await service.find("products");
  });

  afterEach(async () => {
    await module.close();
  });
});
