import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CatagoriesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCatagoryDto: Prisma.CatCreateInput) {
    try{
      // confirmation for name
      if (!createCatagoryDto.name){
        throw new Error('Enter proper catagory name')
      }

      //duplicate checking
      const existingData = await this.databaseService.cat.findUnique({
        where: {
          name: createCatagoryDto.name
        }
      })

      if(existingData){
        throw new Error(`${createCatagoryDto.name} already exists`);
      }

      //going to save
      const result = await this.databaseService.cat.create({
        data: createCatagoryDto
      });
      
      //sending final result
      return result;
    }
    catch(error){
      console.error('Error whild inserting :', error);
      throw error;
    }
  }

  async findAll() {
    // returning all data
    return this.databaseService.cat.findMany();
  }

  async findOne(id: number) {
    try{
      //finding data
      const existingData = await this.databaseService.cat.findMany({
        where: {
          id
        }
      })

      if(existingData.length == 0){
        throw new Error(`Catagory Id - ${id} Not Found`);
      }
      
      //sending data
      const result = await this.databaseService.cat.findUnique({
        where: {
          id
        }
      });

      //sending final result
      return result;
    }
    catch(error){
      console.error('Error whild retrieveing :', error);
      throw error;
    }
  }

  async update(id: number, updateCatagoryDto: Prisma.CatUpdateInput) {
    try{
      // confirmation for name
      if (!updateCatagoryDto.name){
        throw new Error('Enter proper catagory name')
      }

      //duplicate checking
      const existingData = await this.databaseService.cat.findMany({
        where: {
          id
        }
      })

      if(existingData.length == 0){
        throw new Error(`Catagory Id - ${id} Not found`);
      }

      //updating data
      const result = await this.databaseService.cat.update({
        where: {
          id,
        },
        data: updateCatagoryDto
      });

      //sening final result
      return result;
    }
    catch(error){
      console.error('Error whild Updating :', error);
      throw error;
    }
  }

  async remove(id: number) {
    try{
      // finding data
      const existingData = await this.databaseService.cat.findUnique({
        where: {
          id
        }
      })

      if(!existingData){
        throw new Error(`Catagory Id - ${id} Not found`);
      }

      // checking data wheather using or not
      const check = await this.databaseService.course.findFirst({
        where:{
          cat_id: id
        }
      })
      if (check){
        throw new Error(`Connot delete this Catagory Id - ${id}`)
      }

      //deleting data
      const result = await this.databaseService.cat.delete({
        where: {
          id
        }
      });

      //sending final result
      return result;
    }
    catch(error){
      console.error('Error whild Deleting :', error);
      throw error;
    }
  }
}
