import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('test')
export class TestController {
  @Get()
  getHello() {
    return { msg: 'Hello Swagger' };
  }
}
