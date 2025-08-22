import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('test')
export class TestController {
  @Get()
  getTestFunction() {
    const fe_url = process.env.FRONTEND_PORT;

    return { frontend_url: fe_url };
  }
}
