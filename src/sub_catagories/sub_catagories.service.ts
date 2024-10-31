import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { error } from 'console';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubCatagoriesService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createSubCatagoryDto: Prisma.Sub_catCreateInput) {
    try{
      // confirmation for name
      if (!createSubCatagoryDto.name){
        throw new Error('Enter proper sub-catagory name')
      }

      //duplicate checking
      const existingData = await this.databaseService.sub_cat.findUnique({
        where: {
          name: createSubCatagoryDto.name
        }
      })

      if(existingData){
        throw new Error(`${createSubCatagoryDto.name} already exists`);
      }

      //going to save
      return this.databaseService.sub_cat.create({
        data: createSubCatagoryDto
      });
    }
    catch(error){
      console.error('Error whild inserting :', error);
      throw error;
    }
  }

  async findAll() {
    // returning all data
    return this.databaseService.sub_cat.findMany();
  }

  async findOne(id: number) {
    try{
      //finding data
      const existingData = await this.databaseService.sub_cat.findUnique({
        where: {
          id
        }
      })
      if(!existingData){
        throw new Error(`Sub-Catagory Id ${id} not found`);
      }
      
      //sending data 
      return this.databaseService.sub_cat.findUnique({
        where:{
          id,
        }
      });
    }
    catch(error){
      console.error('Error whild retrieving :', error);
      throw error;
    }
  }

  async update(id: number, updateSubCatagoryDto: Prisma.Sub_catUpdateInput) {
    try{
      // confirmation for name
      if (!updateSubCatagoryDto.name){
        throw new Error('Enter proper sub-catagory name')
      }
      
      //Finding data
      const existingData = await this.databaseService.sub_cat.findUnique({
        where: {
          id
        }
      })
      if(!existingData){
        throw new Error(`Sub-Catagory Id ${id} not found`);
      }

      //updating data in table
      return this.databaseService.sub_cat.update({
        where: {
          id
        },
        data: updateSubCatagoryDto
      });

    }
    catch(error){
      console.error('Error whild updating :', error);
      throw error;
    }
  }

  async remove(id: number) {
    try{
      // finding data
      const existingData = await this.databaseService.sub_cat.findUnique({
        where: {
          id
        }
      })
      if(!existingData){
        throw new Error(`Sub-Catagory Id ${id} not found`);
      }

      // checking data wheather using or not
      const check = await this.databaseService.course.findFirst({
        where:{
          sub_cat_id: id
        }
      })
      if (check){
        throw new Error(`Connot delete this Sub-Catagory Id - ${id}`)
      }

      // deleting the data
      return this.databaseService.sub_cat.delete({
        where: {
          id
        }
      });
    }
    catch(error){
      console.error('Error whild deleting :', error);
      throw error;
    }
  }
}
