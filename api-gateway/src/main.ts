import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Pipes globales para validar DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Elimina propiedades no incluidas en los DTO
        forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
        transform: true, // Convierte tipos (por ejemplo, string a number)
      }),
    );

    // Swagger config
    const config = new DocumentBuilder()
      .setTitle('API Gateway')
      .setDescription('Documentación centralizada de la API')
      .setVersion('1.0')
      .addBearerAuth() // si usás JWT
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`✅ API Gateway corriendo en http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Error al iniciar la API Gateway:', error);
    process.exit(1);
  }
}

void bootstrap();
