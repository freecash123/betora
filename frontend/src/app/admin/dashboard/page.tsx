'use client';
import React from 'react';
import { Users, Activity, TrendingUp, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';

const STATS = [
  { label: 'Registered Users', value: '2,847', icon: Users, color: 'text-info' },
  { label: 'Active Users (24h)', value: '1,203', icon: Activity, color: 'text-accent' },
  { label: 'Bets Today', value: '5,421', icon: TrendingUp, color: 'text-primary' },
  { label: 'GGR Today', value: '$48,250', icon: DollarSign, color: 'text-success' },
  { label: 'Deposits Today', value: '$32,100', icon: DollarSign, color: 'text-accent' },
  { label: 'Pending KYC', value: '45', icon: ShieldCheck, color: 'text-warning' },
  { label: 'Risk Alerts', value: '3', icon: AlertTriangle, color: 'text-error' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <h1 className="text-2xl font-extrabold mb-6">BETORA Admin Dashboard</h1>
      <div className="bg-warning/10 border border-warning/30 rounded-bet p-3 mb-6 text-warning text-sm">⚠️ <strong>DEMO MODE</strong> — All data shown is simulated.</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-surface-light border border-surface-border rounded-bet p-5">
            <div className="flex items-center justify-between mb-3"><span className="text-sm text-text-muted">{s.label}</span><s.icon size={20} className={s.color} /></div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Users','Sportsbook','Bets','Wallet','Promotions','Risk','Support','Audit'].map(l => (
          <a key={l} href={`/admin/${l.toLowerCase()}`} className="bg-surface-light border border-surface-border rounded-bet p-4 hover:border-primary/40 transition-all text-center text-sm font-medium">{l}</a>
        ))}
      </div>
    </div>
  );
}