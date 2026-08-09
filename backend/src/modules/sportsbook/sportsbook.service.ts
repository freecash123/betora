import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SportsbookService {
  private readonly logger = new Logger(SportsbookService.name);
  constructor(private prisma: PrismaService) {}

  async getSports() { return this.prisma.sport.findMany({ where: { is_active: true }, orderBy: { sort_order: 'asc' } }); }
  async getCompetitions(sportSlug?: string) { return this.prisma.competition.findMany({ where: { is_active: true, ...(sportSlug?{sport:{slug:sportSlug}}:{}) }, include:{sport:true}, orderBy:{sort_order:'asc'} }); }

  async getEvents(params: { sportSlug?: string; status?: string; isLive?: boolean; search?: string; page: number; limit: number }) {
    const where: any = {};
    if (params.sportSlug) where.sport = { slug: params.sportSlug };
    if (params.status) where.status = params.status;
    if (params.isLive !== undefined) where.is_live = params.isLive;
    if (params.search) where.OR = [{ home_team: { contains: params.search, mode: 'insensitive' } }, { away_team: { contains: params.search, mode: 'insensitive' } }];
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({ where, include: { sport:true, competition:true, markets:{include:{selections:{orderBy:{sort_order:'asc'}}},where:{status:'OPEN'},orderBy:{sort_order:'asc'}} }, orderBy:[{is_live:'desc'},{start_time:'asc'}], skip:(params.page-1)*params.limit, take:params.limit }),
      this.prisma.event.count({ where }),
    ]);
    return { events: events.map(e=>this.formatEvent(e)), total, page:params.page, limit:params.limit, totalPages:Math.ceil(total/params.limit) };
  }

  async getEvent(eventId: string) {
    const e = await this.prisma.event.findUnique({ where:{id:eventId}, include:{sport:true,competition:true,markets:{include:{selections:{orderBy:{sort_order:'asc'}}},orderBy:{sort_order:'asc'}}} });
    return e?this.formatEvent(e):null;
  }

  async getLiveEvents(sportSlug?:string) { return this.getEvents({sportSlug,isLive:true,page:1,limit:50}); }
  async getUpcomingEvents(sportSlug?:string) { return this.getEvents({sportSlug,status:'UPCOMING',page:1,limit:50}); }
  async getPopularEvents() { return this.prisma.event.findMany({ where:{start_time:{gte:new Date()},status:{in:['UPCOMING','LIVE']}}, include:{sport:true,competition:true,markets:{include:{selections:true},where:{status:'OPEN'}}}, orderBy:{start_time:'asc'}, take:10 }).then(es=>es.map(e=>this.formatEvent(e))); }

  private formatEvent(e:any) {
    return { id:e.id, homeTeam:e.home_team, awayTeam:e.away_team, startTime:e.start_time, status:e.status, homeScore:e.home_score, awayScore:e.away_score, clock:e.clock, isLive:e.is_live,
      sport:e.sport?{id:e.sport.id,name:e.sport.name,slug:e.sport.slug,icon:e.sport.icon}:null,
      competition:e.competition?{id:e.competition.id,name:e.competition.name,slug:e.competition.slug,country:e.competition.country}:null,
      markets:e.markets?.map((m:any)=>({id:m.id,name:m.name,marketType:m.market_type,status:m.status,selections:m.selections?.map((s:any)=>({id:s.id,name:s.name,odds:Number(s.odds),status:s.status}))}))||[],
      stats:e.stats||{} };
  }
}