import { Module } from '@nestjs/common';
import { SubCatagoriesService } from './sub_catagories.service';
import { SubCatagoriesController } from './sub_catagories.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubCatagoriesController],
  providers: [SubCatagoriesService],
})
export class SubCatagoriesModule {}
