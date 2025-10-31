import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { StatistiquesService } from './common/statistiques.service';
import { Stat } from './entitites/stat.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly statService: StatistiquesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('stats')
  getStats(): Stat[] {
    return this.statService.obtenirStatitistique();
  }
}
