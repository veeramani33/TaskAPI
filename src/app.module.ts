import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SubCatagoriesModule } from './sub_catagories/sub_catagories.module';
import { CatagoriesModule } from './catagories/catagories.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [ DatabaseModule, SubCatagoriesModule, CatagoriesModule, CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
