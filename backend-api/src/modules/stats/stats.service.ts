import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stats } from 'src/entities/stats.entity';
import { WebsiteVisit } from 'src/entities/website_visit.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepo: Repository<Stats>,
    @InjectRepository(WebsiteVisit)
    private readonly websiteVisitRepo: Repository<WebsiteVisit>,
  ) {}

  async getStats() {
    return this.statsRepo.find();
  }

  async addVisitor(ip: string, userId?: number) {
    try {
      const existingVisit = await this.websiteVisitRepo.findOne({
        where: {
          ip,
          userId,
        },
      });

      if (existingVisit) {
        existingVisit.visitedAt = new Date();
        return await this.websiteVisitRepo.save(existingVisit);
      }

      const visitor = this.websiteVisitRepo.create({ ip, userId });
      return await this.websiteVisitRepo.save(visitor);
    } catch (error) {
      return [];
    }
  }
  async getTotalVisits() {
    return this.websiteVisitRepo.count();
  }
  async getOnlineUsers() {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    return this.websiteVisitRepo.count({
      where: { visitedAt: MoreThan(oneMinuteAgo) },
    });
  }
}
