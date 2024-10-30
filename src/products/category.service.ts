import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  private category: CategoryEntity[]=[
    {id: 1, name: "cat1", description: "desc1", isActive: true},
  ] 
  createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category: CategoryEntity = {
        ...createCategoryDto,
        isActive: true,
        id: this.category.length+1
      }
      if( !category ){
        throw new BadRequestException("category not create!");
      }
  
      this.category.push(category); 
      return category
    } catch (error) {
      throw new InternalServerErrorException("500 Server Error");
    }
  }
  findOne(id: number) {
    try{
      const category = this.category.find(category => category.id === id && category.isActive === true)
      if(!category) throw new NotFoundException('Category not found')
      return category;
    }catch(error){
      throw new InternalServerErrorException('500 Server Error')
    }
  }

}