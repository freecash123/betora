import { v4 as uuidv4 } from 'uuid';

export function calculateAccumulatorOdds(odds: number[]): number {
  return odds.reduce((total, odd) => total * odd, 1);
}

export function calculatePotentialWinnings(stake: number, totalOdds: number): number {
  return +(stake * totalOdds).toFixed(2);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

export function generateBetId(): string {
  const prefix = 'BET';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().slice(0, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateIdempotencyKey(prefix: string = 'IDEM'): string {
  return `${prefix}-${uuidv4()}`;
}

export function validateStake(stake: number, minStake: number, maxStake: number, balance: number): { valid: boolean; error?: string } {
  if (stake < minStake) return { valid: false, error: `Minimum stake is ${formatCurrency(minStake)}` };
  if (stake > maxStake) return { valid: false, error: `Maximum stake is ${formatCurrency(maxStake)}` };
  if (stake > balance) return { valid: false, error: 'Insufficient balance' };
  return { valid: true };
}

export function hasOddsChanged(currentOdds: number, takenOdds: number, threshold: number = 0.05): boolean {
  return Math.abs(currentOdds - takenOdds) / takenOdds > threshold;
}

export function generateTransactionRef(type: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().slice(0, 8).toUpperCase();
  return `TXN-${type}-${timestamp}-${random}`;
}