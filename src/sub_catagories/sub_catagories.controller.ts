import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubCatagoriesService } from './sub_catagories.service';
import { Prisma } from '@prisma/client';

@Controller('sub-catagories')
export class SubCatagoriesController {
  constructor(private readonly subCatagoriesService: SubCatagoriesService) {}

  @Post()
  create(@Body() createSubCatagoryDto: Prisma.Sub_catCreateInput) {
    return this.subCatagoriesService.create(createSubCatagoryDto);
  }

  @Get()
  findAll() {
    return this.subCatagoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCatagoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubCatagoryDto: Prisma.Sub_catUpdateInput) {
    return this.subCatagoriesService.update(+id, updateSubCatagoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCatagoriesService.remove(+id);
  }
}
