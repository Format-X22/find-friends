import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';

async function bootstrap(): Promise<void> {
    const app: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);
}
bootstrap();
