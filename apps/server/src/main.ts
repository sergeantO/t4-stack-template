import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppRouter } from './app.router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const trpc = app.get(AppRouter);
  trpc.applyMiddleware(app);

  const port = process.env.PORT || 4000; // Меняем порт
  await app.listen(port);
  Logger.log(`Server started on port: ${port}`, 'bootstrap')
}
bootstrap();
