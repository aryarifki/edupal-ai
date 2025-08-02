import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

function validateEnvironment(configService: ConfigService) {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(key => !configService.get(key));
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }

  // Warn about missing AI API keys but don't exit
  const aiKeys = ['OPENAI_API_KEY', 'KIMI_API_KEY'];
  const missingAIKeys = aiKeys.filter(key => !configService.get(key));
  
  if (missingAIKeys.length > 0) {
    console.warn('⚠️  Missing AI API keys (some features may not work):', missingAIKeys.join(', '));
  } else {
    console.log('✅ All AI API keys configured');
  }

  console.log('✅ Environment validation passed');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validate environment variables
  validateEnvironment(configService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('EduPal AI API')
    .setDescription('AI-powered educational platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('API_PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();