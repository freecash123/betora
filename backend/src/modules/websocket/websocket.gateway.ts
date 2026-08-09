import { WebSocketGateway as WSGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WSGateway({ cors: { origin: '*' }, namespace: '/betora', transports: ['websocket','polling'] })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) { client.disconnect(); return; }
      const payload = this.jwtService.verify(token as string);
      const userId = payload.sub;
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId).add(client.id);
      client.join(`user:${userId}`);
      client.data.userId = userId;
      client.emit('connected', { userId, socketId: client.id, timestamp: new Date().toISOString() });
    } catch { client.disconnect(); }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId && this.userSockets.has(userId)) { this.userSockets.get(userId).delete(client.id); if (this.userSockets.get(userId).size===0) this.userSockets.delete(userId); }
  }

  @SubscribeMessage('subscribe:event') handleSubscribeEvent(@ConnectedSocket() c: Socket, @MessageBody() d: {eventId:string}) { c.join(`event:${d.eventId}`); return {subscribed:true,eventId:d.eventId}; }
  @SubscribeMessage('subscribe:live') handleSubscribeLive(@ConnectedSocket() c: Socket) { c.join('live:all'); return {subscribed:true}; }

  emitOddsUpdate(eventId:string,marketId:string,selectionId:string,oldOdds:number,newOdds:number) { this.server.to(`event:${eventId}`).emit('ODDS_UPDATE',{type:'ODDS_UPDATE',payload:{eventId,marketId,selectionId,oldOdds,newOdds},timestamp:new Date().toISOString()}); }
  emitScoreUpdate(eventId:string,homeScore:number,awayScore:number,clock?:string) { this.server.to(`event:${eventId}`).emit('SCORE_UPDATE',{type:'SCORE_UPDATE',payload:{eventId,homeScore,awayScore,clock},timestamp:new Date().toISOString()}); this.server.to('live:all').emit('SCORE_UPDATE',{type:'SCORE_UPDATE',payload:{eventId,homeScore,awayScore,clock},timestamp:new Date().toISOString()}); }
  emitBalanceUpdate(userId:string,balance:any) { this.server.to(`user:${userId}`).emit('BALANCE_UPDATE',{type:'BALANCE_UPDATE',payload:balance,timestamp:new Date().toISOString()}); }
  emitNotification(userId:string,notification:any) { this.server.to(`user:${userId}`).emit('NOTIFICATION',{type:'NOTIFICATION',payload:notification,timestamp:new Date().toISOString()}); }
  isUserOnline(userId:string):boolean { return this.userSockets.has(userId) && this.userSockets.get(userId).size>0; }
}