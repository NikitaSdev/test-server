import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.setGlobalPrefix("api")
  await app.enableCors()
  await app.listen(5000)
}
bootstrap()
