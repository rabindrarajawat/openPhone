import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Adjust according to your frontend URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTOs
    }),
  );

  // Determine the port from the environment or use default
  const port = process.env.APP_PORT || 8000;
  await app.listen(port);
  console.log(`Openphone app is running on port: ${port}`);
}

bootstrap();
