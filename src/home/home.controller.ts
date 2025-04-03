/* eslint-disable prettier/prettier */
import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private service: HomeService) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appInfo(@Req() req: Request) {
    console.log(req.headers);
    return this.service.appInfo();
  }
}
