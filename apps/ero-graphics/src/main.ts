import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import { EroGraphicsModule } from "./ero-graphics.module";

dotenv.config();

async function bootstrap() {
  await NestFactory.createApplicationContext(EroGraphicsModule);
}
bootstrap();
