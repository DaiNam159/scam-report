import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsStatus } from '../../entities/news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async create(@Body() createNewsDto: CreateNewsDto, @Req() req: any) {
    const authorId = req.user?.id || 1; // Default to admin if no user
    return this.newsService.create(createNewsDto, authorId);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: NewsStatus,
  ) {
    return this.newsService.findAll(page, limit, status);
  }

  @Get('published')
  async findPublished(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.newsService.findPublished(page, limit);
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit: number = 5) {
    return this.newsService.getFeatured(limit);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.newsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.newsService.delete(id);
    return { message: 'News deleted successfully' };
  }
}
