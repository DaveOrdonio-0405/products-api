import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import * as redisStore from 'cache-manager-ioredis'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CacheModule.register({
      store: redisStore, 
      host: 'localhost', 
      port: 6379,        
      ttl: 60,          
    }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
