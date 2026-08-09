'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BetSlipDrawer } from '@/components/betting/BetSlipDrawer';
import { EventCard } from '@/components/sportsbook/EventCard';
import { useBetSlipStore } from '@/lib/stores/betSlipStore';
import { Activity, Clock, Star, TrendingUp } from 'lucide-react';

const DEMO_EVENTS = [
  { id: '1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeScore: 1, awayScore: 0, clock: "32'", isLive: true, status: 'LIVE', startTime: new Date().toISOString(), sport: { name: 'Football', slug: 'football', icon: '⚽' }, competition: { name: 'Premier League' }, markets: [{ id: 'm1', name: 'Match Result', marketType: '1x2', status: 'OPEN', selections: [{ id: 's1', name: 'Arsenal', odds: 2.10, status: 'OPEN' }, { id: 's2', name: 'Draw', odds: 3.40, status: 'OPEN' }, { id: 's3', name: 'Chelsea', odds: 3.20, status: 'OPEN' }] }, { id: 'm2', name: 'Over/Under 2.5', marketType: 'over_under', status: 'OPEN', selections: [{ id: 's4', name: 'Over 2.5', odds: 1.85, status: 'OPEN' }, { id: 's5', name: 'Under 2.5', odds: 1.95, status: 'OPEN' }] }] },
  { id: '2', homeTeam: 'Manchester City', awayTeam: 'Liverpool', isLive: false, status: 'UPCOMING', startTime: new Date(Date.now() + 3600000).toISOString(), sport: { name: 'Football', slug: 'football', icon: '⚽' }, competition: { name: 'Premier League' }, markets: [{ id: 'm3', name: 'Match Result', marketType: '1x2', status: 'OPEN', selections: [{ id: 's7', name: 'Man City', odds: 1.80, status: 'OPEN' }, { id: 's8', name: 'Draw', odds: 3.75, status: 'OPEN' }, { id: 's9', name: 'Liverpool', odds: 4.20, status: 'OPEN' }] }] },
  { id: '6', homeTeam: 'LA Lakers', awayTeam: 'Warriors', homeScore: 56, awayScore: 52, clock: 'Q2 4:30', isLive: true, status: 'LIVE', startTime: new Date().toISOString(), sport: { name: 'Basketball', slug: 'basketball', icon: '🏀' }, competition: { name: 'NBA' }, markets: [{ id: 'm10', name: 'Moneyline', marketType: 'moneyline', status: 'OPEN', selections: [{ id: 's20', name: 'Lakers', odds: 1.90, status: 'OPEN' }, { id: 's21', name: 'Warriors', odds: 1.90, status: 'OPEN' }] }] },
];

export default function HomePage() {
  const [events] = useState(DEMO_EVENTS);
  const { isOpen } = useBetSlipStore();

  return (
    <div className="flex min-h-screen">
      <main className={`flex-1 pt-20 pb-20 lg:pb-6 px-4 lg:px-6 ${isOpen ? 'lg:mr-80' : ''}`}>
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">Play the Game. <span className="text-primary">Own the Moment.</span></h1>
          <p className="text-text-secondary text-sm">Welcome to BETORA — premium sports betting</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[{ label: 'Live Events', value: '3', icon: Activity, color: 'text-error' }, { label: "Today's Events", value: '24', icon: Clock, color: 'text-info' }, { label: 'Upcoming', value: '48', icon: TrendingUp, color: 'text-accent' }, { label: 'Sports', value: '10', icon: Star, color: 'text-primary' }].map(s => (
            <div key={s.label} className="bg-surface-light border border-surface-border rounded-bet p-4"><s.icon size={20} className={`${s.color} mb-2`} /><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-text-muted">{s.label}</div></div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold flex items-center gap-2"><span className="w-2 h-2 bg-error rounded-full live-pulse" />Live Now</h2><Link href="/live" className="text-sm text-primary hover:underline">View All →</Link></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.filter(e => e.isLive).map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </main>
      <BetSlipDrawer />
    </div>
  );
}