'use client';

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useBetSlipStore } from '@/lib/stores/betSlipStore';
import { useAuth } from '@/app/layout';
import toast from 'react-hot-toast';

export function BetSlipDrawer() {
  const { items, stake, betType, isOpen, setOpen, removeItem, clearSlip, setStake, setBetType } = useBetSlipStore();
  const { user, token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalOdds = items.reduce((t, i) => t * i.odds, 1);
  const winnings = (parseFloat(stake) || 0) * totalOdds;

  const handlePlace = async () => {
    if (!user) { toast.error('Sign in to place bets'); return; }
    const s = parseFloat(stake);
    if (!s || s < 0.5) { toast.error('Min stake $0.50'); return; }
    if (!items.length) { toast.error('Add selections'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/betting/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': `BET-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        },
        body: JSON.stringify({
          type: betType,
          stake: s,
          selections: items.map((i) => ({ selectionId: i.selectionId, odds: i.odds })),
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || 'Failed');
      setPlaced(d.betRef || d.id);
      toast.success('Bet placed!');
      setTimeout(() => { clearSlip(); setPlaced(null); setOpen(false); }, 2000);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hidden lg:block fixed right-0 top-20 bottom-0 w-80 bg-surface-light border-l border-surface-border z-30 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-surface-light border-b border-surface-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg">Bet Slip</h2>
          {items.length > 0 && (
            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{items.length}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button onClick={clearSlip} className="text-text-muted hover:text-error">
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={() => setOpen(false)} className="text-text-muted hover:text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Bet Type Toggle */}
      {items.length > 0 && (
        <div className="px-4 py-2 flex gap-2">
          <button
            onClick={() => setBetType('SINGLE')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-bet ${betType === 'SINGLE' ? 'bg-primary text-white' : 'bg-surface-lighter text-text-secondary'}`}
          >
            Singles
          </button>
          <button
            onClick={() => setBetType('MULTIPLE')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-bet ${betType === 'MULTIPLE' ? 'bg-primary text-white' : 'bg-surface-lighter text-text-secondary'}`}
          >
            Acca
          </button>
        </div>
      )}

      {/* Items */}
      <div className="px-4 pt-2">
        {items.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <div className="text-4xl mb-3">🎫</div>
            <p className="text-sm">Your bet slip is empty</p>
            <p className="text-xs mt-1">Click odds to add selections</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.selectionId} className="bg-surface rounded-bet p-3 relative group">
                <button
                  onClick={() => removeItem(i.selectionId)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-text-muted hover:text-error"
                >
                  <X size={14} />
                </button>
                <div className="text-xs text-text-muted mb-1">
                  {i.homeTeam} vs {i.awayTeam}
                  {i.isLive && <span className="ml-1 text-error live-pulse">● LIVE</span>}
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">{i.selectionName}</div>
                    <div className="text-xs text-text-muted">{i.marketName}</div>
                  </div>
                  <div className="text-sm font-bold text-primary">{i.odds.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="px-4 py-4 border-t border-surface-border mt-4">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-text-secondary">Total Odds</span>
            <span className="text-lg font-bold text-primary">{totalOdds.toFixed(2)}</span>
          </div>
          <div className="mb-3">
            <label className="text-xs text-text-muted mb-1 block">Stake</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.00"
                min="0.50"
                className="bet-input pl-7"
              />
            </div>
            <div className="flex gap-1 mt-1">
              {[5, 10, 25, 50, 100].map((a) => (
                <button
                  key={a}
                  onClick={() => setStake(String(a))}
                  className="text-xs px-2 py-0.5 rounded bg-surface-lighter text-text-secondary hover:bg-primary/20 hover:text-primary"
                >
                  ${a}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-accent/10 border border-accent/30 rounded-bet p-3 mb-4">
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary">Potential Winnings</span>
              <span className="text-lg font-bold text-accent">${winnings.toFixed(2)}</span>
            </div>
          </div>
          {placed ? (
            <div className="bg-success/10 border border-success/30 rounded-bet p-3 text-center">
              <div className="text-success font-semibold text-sm">✅ Bet Placed!</div>
              <div className="text-xs text-text-muted mt-1">Ref: {placed}</div>
            </div>
          ) : (
            <button
              onClick={handlePlace}
              disabled={submitting || !stake || !items.length}
              className="bet-button w-full py-3 text-base"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Placing...
                </span>
              ) : !user ? (
                'Sign In to Place Bet'
              ) : (
                'Place Bet'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
