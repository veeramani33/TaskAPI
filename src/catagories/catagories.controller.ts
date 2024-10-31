import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatagoriesService } from './catagories.service';
import { Prisma } from '@prisma/client';

@Controller('catagories')
export class CatagoriesController {
  constructor(private readonly catagoriesService: CatagoriesService) {}

  @Post()
  create(@Body() createCatagoryDto: Prisma.CatCreateInput) {
    return this.catagoriesService.create(createCatagoryDto);
  }

  @Get()
  findAll() {
    return this.catagoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catagoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatagoryDto: Prisma.CatUpdateInput) {
    return this.catagoriesService.update(+id, updateCatagoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catagoriesService.remove(+id);
  }
}
