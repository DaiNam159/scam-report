import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Stats } from 'src/entities/stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteVisit } from 'src/entities/website_visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stats, WebsiteVisit])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
