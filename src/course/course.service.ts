import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { error } from 'console';
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

        //checking duplications
        const dub_check = await this.databaseService.course.findMany({
          where:{
            name: createCourseDto.name,
            cat_id: createCourseDto.category,
            sub_cat_id: createCourseDto.sub_category
          }
        })
        if (dub_check.length > 0){
          throw new Error('Already Same Data Exists')
        }

        // saving data
        return this.databaseService.course.create({
          data: createCourseDto
        });
    }
    catch(error){
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
      return this.databaseService.course.findUnique({
        where: {
          id
        }
      });
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
          name: updateCourseDto.name,
          cat_id: updateCourseDto.category,
          sub_cat_id: updateCourseDto.sub_category
        }
      })
      if (dub_check.length > 0){
        throw new Error('Already Same Data Exists')
      }

      //updating data
      return this.databaseService.course.update({
        where: {
          id,
        },
        data: updateCourseDto
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
      const existingCourse = await this.databaseService.course.findUnique({
        where: {
          id
        }
      })
      if(!existingCourse){
        throw new Error(`Course Id ${id} not found`);
      }
      
      //deleting data
      return this.databaseService.course.delete({
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
