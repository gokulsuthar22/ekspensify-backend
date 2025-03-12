import { Controller, Get } from '@nestjs/common';

@Controller({ path: '/', version: '' })
export class AppController {
  @Get()
  healthCheck() {
    return {
      health: 'OK',
    };
  }
}
