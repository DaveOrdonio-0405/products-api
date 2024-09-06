import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductModule } from './product/product.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston-logger.config';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest_products_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register({
      store: 'ioredis',
      host: 'localhost',
      port: 6379,
    }),
    WinstonModule.forRoot(winstonConfig),
    ProductModule,
  ],
})
export class AppModule {}
