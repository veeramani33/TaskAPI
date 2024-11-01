import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CourseService {
  constructor (private readonly databaseService: DatabaseService) { }

  async create(createCourseDto: Prisma.CourseCreateInput) {
    try{
        // confirmation for name, catagory and sub_catagory
        if (!createCourseDto.name){
          throw new Error('Enter proper course name')
        }
        if (!createCourseDto.category || typeof createCourseDto.category !== 'number'){
          throw new Error('Enter proper catagory id')
        }
        if (!createCourseDto.sub_category || typeof createCourseDto.sub_category !== 'number'){
          throw new Error('Enter proper Sub-Catagory')
        }

        // validation for receiving data is preset in correponding table or not
        const checking_cat = await this.databaseService.cat.findUnique({
          where:{
            id : createCourseDto.category
          }
        })

        if(!checking_cat){
          throw new Error('Entered value is not present in Catagory')
        }

        const checking_sub_cat = await this.databaseService.sub_cat.findUnique({
          where:{
            id : createCourseDto.sub_category
          }
        })

        if(!checking_sub_cat){
          throw new Error('Entered value is not present in Sub Catagory')
        }

        //checking duplications
        const dub_check = await this.databaseService.course.findFirst({
          where:{
            name: { equals: createCourseDto.name, mode: 'insensitive' },
            category: { id: createCourseDto.category },
            sub_category: { id: createCourseDto.sub_category }
          }
        })
        if (dub_check){
          throw new Error('same name, category, and sub-category already exists.');
        }

        // saving data
        const result = await this.databaseService.course.create({
          data: {
            name: createCourseDto.name,
            category: {
              connect: { id: createCourseDto.category }, 
            },
            sub_category: {
              connect: { id: createCourseDto.sub_category },  
            },
          },
        });
        
        //sending final result
        return result;
    }
    catch(error){
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('Duplicate entry detected for name, category, and sub-category.');
      }
      console.error('Error whild inserting :', error);
      throw error;
    }
  }

  async findAll() {
    
    //retireving related data
    const courses = await this.databaseService.course.findMany({
      include: {
        category: {
          select: { name: true }
        },
        sub_category: {
          select: { id: true } 
        }
      }
    });
    
    // filtering data and saving into array
    const uniqueCourses = courses.reduce((acc, course) => {
      const existingCourse = acc.find(
        (c) => c.courseName === course.name && c.categoryName === course.category.name
      );

      if (!existingCourse) {
        const uniqueSubCatIds = new Set(courses
          .filter(c => c.name === course.name && c.category.name === course.category.name)
          .map(c => c.sub_cat_id)
        );
    
        acc.push({
          courseName: course.name,
          categoryName: course.category.name,
          subCategoryCount: uniqueSubCatIds.size
        });
      }
      return acc;
    }, []);

    //sending data 
    return [{ courses: uniqueCourses }];
    
  }

  async findOne(id: number) {
    try{
      // finding data 
      const existingCourse = await this.databaseService.course.findUnique({
        where: {
          id
        }
      })
      if(!existingCourse){
        throw new Error(`Course Id ${id} not found`);
      }

      //sending data
      const result = await this.databaseService.course.findUnique({
        where: {
          id
        }
      });
      
      //for transform the data
      const input = {
        id: result.id,
        name: result.name,
        cat_id: result.cat_id,
        sub_cat_id: result.sub_cat_id
      };
      
      const output = transformCourseData(input);


      //sending final result
      return output;
    }
    catch(error){
      console.error('Error whild retrieving :', error);
      throw error;
    }
  }

  async update(id: number, updateCourseDto: Prisma.CourseUpdateInput) {
    try{
      // validation for name , catagory and sub catagory
      if (!updateCourseDto.name || typeof updateCourseDto.name !== 'string'){
        throw new Error('Enter proper course name')
      }
      if (!updateCourseDto.category || typeof updateCourseDto.category !== 'number'){
        throw new Error('Enter proper catagory id')
      }
      if (!updateCourseDto.sub_category || typeof updateCourseDto.sub_category !== 'number'){
        throw new Error('Enter proper Sub-Catagory')
      }

      // finding data
      const existingCourse = await this.databaseService.course.findUnique({
        where: {
          id
        }
      })
      if(!existingCourse){
        throw new Error(`Course Id ${id} not found`);
      }

      // strong validation to avoid same record
      const dub_check = await this.databaseService.course.findMany({
        where:{
          name: { equals: updateCourseDto.name, mode: 'insensitive' },
          category: { id: updateCourseDto.category },
          sub_category: { id: updateCourseDto.sub_category },
        }
      })
      if (dub_check.length > 0){
        throw new Error('Already Same Data Exists')
      }

      //updating data
      const result = await this.databaseService.course.update({
        where: {
          id,
        },
        data: {
          name: updateCourseDto.name,
          category: {
            connect: { id: updateCourseDto.category }, 
          },
          sub_category: {
            connect: { id: updateCourseDto.sub_category },  
          },
        },
      });
      
      //for transform the data
      const input = {
        id: result.id,
        name: result.name,
        cat_id: result.cat_id,
        sub_cat_id: result.sub_cat_id
      };
      
      const output = transformCourseData(input);


      //sending final result
      return output;
    }
    catch(error){
      console.error('Error whild updating :', error);
      throw error;
    }
  }

  async remove(id: number) {
    try{
      // finding data
      const existingCourse = await this.databaseService.course.findUnique({
        where: {
          id
        }
      })
      if(!existingCourse){
        throw new Error(`Course Id ${id} not found`);
      }
      
      //deleting data
      const result = await this.databaseService.course.delete({
        where: {
          id
        }
      });

      //sending final result
      return result;
    }
    catch(error){
      console.error('Error whild deleting :', error);
      throw error;
    }
  }
}

// After updation result is not reaching expection so this code transform the data as we expected
function transformCourseData(input: { id: number; name: string; cat_id: number; sub_cat_id: number }) {
  return {
    id: input.id,
    name: input.name,
    catagory: input.cat_id,        // Changing 'cat_id' to 'catagory'
    'sub catagory': input.sub_cat_id // Changing 'sub_cat_id' to 'sub catagory'
  };
}