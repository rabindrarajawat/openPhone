import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 

  // Enable CORS for the frontend
  app.enableCors({
     origin: ['http://35.239.250.12', 'http://localhost:3000','http://localhost:3001'],
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


 // Disable built-in body parser only for the route where you need the custom sanitizer
 app.use('/api/openPhoneEventData', express.raw({
  type: 'application/json',
  limit: '50mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

// Keep the built-in body parser enabled for other routes
app.use(express.json());


  // Determine the port from the environment or use default
  const port = process.env.APP_PORT || 8000;
  await app.listen(port);
  console.log(`Openphone app is running on port: ${port}`);
}

bootstrap();
