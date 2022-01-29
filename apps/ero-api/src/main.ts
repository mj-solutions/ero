import { ERO_API_PORT } from "@ero/shared";
import { NestFactory } from "@nestjs/core";
import { EroApiModule } from "./ero-api.module";

async function bootstrap() {
  const app = await NestFactory.create(EroApiModule);
  app.enableCors();
  await app.listen(ERO_API_PORT);
}
bootstrap();
