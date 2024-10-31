import { Module } from '@nestjs/common';
import { CatagoriesService } from './catagories.service';
import { CatagoriesController } from './catagories.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CatagoriesController],
  providers: [CatagoriesService],
})
export class CatagoriesModule {}
