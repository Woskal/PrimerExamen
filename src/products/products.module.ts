import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoryController } from './category.controller';
import { CategoryModule } from './category.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [ CategoryModule ]
})
export class ProductsModule {}
