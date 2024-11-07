import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import * as express from 'express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);


  const app = await NestFactory.create(AppModule, {
    bodyParser: false  // Disable built-in body parser
  });

  // Configure raw body buffer
  app.use(express.raw({
    type: 'application/json',
    limit: '50mb',
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));


  // Enable CORS for the frontend
  app.enableCors({
    // origin: 'http://localhost:3000', // Adjust according to your frontend URL
    // origin: 'http://35.239.250.12', // Frontend URL
    origin: ['http://35.239.250.12', 'http://localhost:3000'],
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
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  // Determine the port from the environment or use default
  const port = process.env.APP_PORT || 8000;
  await app.listen(port);
  console.log(`Openphone app is running on port: ${port}`);
}

bootstrap();
