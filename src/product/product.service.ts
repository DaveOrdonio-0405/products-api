import { Injectable, NotFoundException, Inject, LoggerService } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Cache } from 'cache-manager';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async findAll(): Promise<Product[]> {
    const start = Date.now();
    const cachedProducts = await this.cacheManager.get<Product[]>('products');
    if (cachedProducts) {
      this.logger.log(`Cache hit for all products. Fetch time: ${Date.now() - start} ms`);
      return cachedProducts;
    }
    this.logger.log('Cache miss for all products. Querying database...');
    const products = await this.productRepository.find();
    this.logger.log(`Database query completed. Fetch time: ${Date.now() - start} ms`);
    await this.cacheManager.set('products', products, 60);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const start = Date.now();
    const cachedProduct = await this.cacheManager.get<Product>(`product_${id}`);
    if (cachedProduct) {
      this.logger.log(`Cache hit for product ID ${id}. Fetch time: ${Date.now() - start} ms`);
      return cachedProduct;
    }
    this.logger.log(`Cache miss for product ID ${id}. Querying database...`);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    this.logger.log(`Database query for product ID ${id} completed. Fetch time: ${Date.now() - start} ms`);
    await this.cacheManager.set(`product_${id}`, product,  60);
    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    await this.productRepository.save(product);
    await this.cacheManager.del('products');
    await this.cacheManager.set(`product_${product.id}`, product, 60);
    this.logger.log(`Product ID ${product.id} created and cache updated.`);
    return product;
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    await this.cacheManager.set(`product_${id}`, updatedProduct,  60 );
    await this.cacheManager.del('products');
    this.logger.log(`Product ID ${id} updated and cache refreshed.`);
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products');

    this.logger.log(`Product ID ${id} deleted and cache invalidated.`);
  }
}