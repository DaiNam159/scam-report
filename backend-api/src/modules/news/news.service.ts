import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News, NewsStatus } from '../../entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepo: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto, authorId: number): Promise<News> {
    const slug = this.generateSlug(createNewsDto.title);
    const publishedAt =
      createNewsDto.status === NewsStatus.PUBLISHED ? new Date() : undefined;

    const news = this.newsRepo.create({
      ...createNewsDto,
      slug,
      authorId,
      publishedAt,
    });
    return await this.newsRepo.save(news);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: NewsStatus,
  ): Promise<{ data: News[]; total: number; page: number; limit: number }> {
    const qb = this.newsRepo
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'author')
      .select([
        'news',
        'author.id',
        'author.email',
        'author.fullName',
        'author.avatarUrl',
      ]);

    if (status) {
      qb.where('news.status = :status', { status });
    }

    qb.orderBy('news.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findPublished(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: News[]; total: number; page: number; limit: number }> {
    return this.findAll(page, limit, NewsStatus.PUBLISHED);
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!news) {
      throw new Error('News not found');
    }
    return news;
  }

  async findBySlug(slug: string): Promise<News> {
    const news = await this.newsRepo.findOne({
      where: { slug, status: NewsStatus.PUBLISHED },
      relations: ['author'],
    });
    if (!news) {
      throw new Error('News not found');
    }
    // Increment views
    news.views += 1;
    await this.newsRepo.save(news);
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);

    if (updateNewsDto.title && updateNewsDto.title !== news.title) {
      updateNewsDto.slug = this.generateSlug(updateNewsDto.title);
    }

    if (
      updateNewsDto.status === NewsStatus.PUBLISHED &&
      news.status !== NewsStatus.PUBLISHED
    ) {
      updateNewsDto['publishedAt'] = new Date();
    }

    Object.assign(news, updateNewsDto);
    return await this.newsRepo.save(news);
  }

  async delete(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepo.remove(news);
  }

  async getFeatured(limit: number = 5): Promise<News[]> {
    return await this.newsRepo.find({
      where: { isFeatured: true, status: NewsStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
      take: limit,
      relations: ['author'],
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
