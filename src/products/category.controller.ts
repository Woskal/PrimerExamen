import { Controller, Get, Post, Body, Param  } from '@nestjs/common';
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }
  @Get(':id')
  findOneCategory(@Param('id') id: Number) {
    return this.categoryService.findOne(+id);
  }
}