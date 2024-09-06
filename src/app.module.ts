import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductModule } from './product/product.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'nest_products_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register({
      store: 'ioredis',
      host: 'localhost',
      port: 6379,
    }),
    ProductModule,
  ],
})
export class AppModule {}
