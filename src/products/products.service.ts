import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-products.interface';
import { ManagerError } from 'src/common/errors/manage.error';
import { CategoryService } from './category.service';

@Injectable()
export class ProductsService {
  private products: ProductEntity[] = [
    {id: 1, name: "telefono", description: "xiaomi", stock: 4, price: 3, photo: [], isActive: true, categoryId: 1 }
  ]
  constructor(private readonly categoryService: CategoryService){}
  create(createProductDto: CreateProductDto) {
    try {
      const product: ProductEntity = {
        ...createProductDto,
        isActive: true,
        id: this.products.length+1,
      }
      if( !product ){
        throw new BadRequestException("Product not create!");
      }
  
      this.products.push(product); 
      return product
    } catch (error) {
      throw new InternalServerErrorException("500 Server Error");
    }
  }
  

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllProducts > {
    try {

      if( this.products.length === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Products not found!"
        });
      }
    
      const { page, limit } = paginationDto;
      const total = this.products.filter((product) => product.isActive===true).length

      const skip = ( page - 1 ) * limit;

      const lastPage = Math.ceil(total / limit);
      
      const data = this.products.slice( skip, limit );

      return {
        page,
        lastPage,
        total,
        limit,
        data
      }
      
    } catch (error) {
      ManagerError.createSignatureError( error.message )
    }
  }

  findOne(id: number) {
    try{
      const product = this.products.find(product => product.id === id && product.isActive === true)
      if(!product) throw new NotFoundException('Product not found')
        const category = this.categoryService.findOne(product.categoryId)
      return {product, category};
    }catch(error){
      throw new InternalServerErrorException('500 Server Error')
    }
  }

  

  update(id: number, updateProductDto: UpdateProductDto) {
    try { 
      let productDB = this.products.find(product => product.id === id)
      
      this.products = this.products.map(product => {
        if(product.id === id){
          productDB = {
            ...productDB,
            ...updateProductDto
          }
          return productDB
        }
        return product;
      })
  }
  catch{
    throw new InternalServerErrorException('500 Server Error')
  }
}

  delete(id: number) {
    try {
      const productDB = this.products.find(product => product.id === id)
      if(!productDB) throw new NotFoundException('Product not found')
      this.products = this.products.filter(product => product.id !== id)

      return 'Producto Eliminad'
    } catch (error) {
      throw new InternalServerErrorException('500 Server Error')
    }
  
  }

}
