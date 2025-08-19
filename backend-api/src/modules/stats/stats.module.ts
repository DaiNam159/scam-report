import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Stats } from 'src/entities/stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
