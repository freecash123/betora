import { Controller, Get, Param, Query } from '@nestjs/common';
import { SportsbookService } from './sportsbook.service';

@Controller('sportsbook')
export class SportsbookController {
  constructor(private readonly sportService: SportsbookService) {}

  @Get('sports') async getSports() { return this.sportService.getSports(); }
  @Get('competitions') async getCompetitions(@Query('sport') sport?:string) { return this.sportService.getCompetitions(sport); }
  @Get('events') async getEvents(@Query('sport') sport?:string,@Query('status') status?:string,@Query('isLive') isLive?:string,@Query('search') search?:string,@Query('page') page?:number,@Query('limit') limit?:number) { return this.sportService.getEvents({ sportSlug:sport, status, isLive: isLive==='true', search, page: page?+page:1, limit: limit?+limit:20 }); }
  @Get('events/:id') async getEvent(@Param('id') id:string) { return this.sportService.getEvent(id); }
  @Get('live') async getLive(@Query('sport') sport?:string) { return this.sportService.getLiveEvents(sport); }
  @Get('upcoming') async getUpcoming(@Query('sport') sport?:string) { return this.sportService.getUpcomingEvents(sport); }
  @Get('popular') async getPopular() { return this.sportService.getPopularEvents(); }
}