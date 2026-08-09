// ============================================================
// BETORA Shared Types
// ============================================================

export enum BetStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  VOID = 'VOID',
  HALF_WON = 'HALF_WON',
  HALF_LOST = 'HALF_LOST',
  CASHED_OUT = 'CASHED_OUT',
  PENDING_SETTLEMENT = 'PENDING_SETTLEMENT',
}

export enum BetType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
  SYSTEM = 'SYSTEM',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  BET_PLACED = 'BET_PLACED',
  BET_WON = 'BET_WON',
  BET_REFUND = 'BET_REFUND',
  BONUS_CREDIT = 'BONUS_CREDIT',
  BONUS_DEBIT = 'BONUS_DEBIT',
  ADJUSTMENT = 'ADJUSTMENT',
  CASHOUT = 'CASHOUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REVERSED = 'REVERSED',
}

export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  REQUIRES_INFO = 'REQUIRES_INFO',
}

export enum KYCLevel { BASIC = 'BASIC', INTERMEDIATE = 'INTERMEDIATE', ADVANCED = 'ADVANCED' }
export enum EventStatus { UPCOMING = 'UPCOMING', LIVE = 'LIVE', FINISHED = 'FINISHED', POSTPONED = 'POSTPONED', CANCELLED = 'CANCELLED', SUSPENDED = 'SUSPENDED' }
export enum MarketStatus { OPEN = 'OPEN', SUSPENDED = 'SUSPENDED', CLOSED = 'CLOSED', SETTLED = 'SETTLED' }
export enum PaymentMethodType { CARD = 'CARD', BANK_TRANSFER = 'BANK_TRANSFER', E_WALLET = 'E_WALLET', LOCAL_PAYMENT = 'LOCAL_PAYMENT', CRYPTO = 'CRYPTO' }
export enum PromotionType { WELCOME = 'WELCOME', DEPOSIT_BONUS = 'DEPOSIT_BONUS', FREE_BET = 'FREE_BET', CASHBACK = 'CASHBACK', ODDS_BOOST = 'ODDS_BOOST', VIP = 'VIP', LOYALTY = 'LOYALTY' }
export enum BonusStatus { ACTIVE = 'ACTIVE', USED = 'USED', EXPIRED = 'EXPIRED', FORFEITED = 'FORFEITED' }
export enum UserRole { USER = 'USER', ADMIN = 'ADMIN', SUPER_ADMIN = 'SUPER_ADMIN', RISK_MANAGER = 'RISK_MANAGER', SUPPORT_AGENT = 'SUPPORT_AGENT', PAYMENT_AGENT = 'PAYMENT_AGENT', TRADER = 'TRADER' }
export enum NotificationType { BET_PLACED = 'BET_PLACED', BET_SETTLED = 'BET_SETTLED', ODDS_CHANGED = 'ODDS_CHANGED', DEPOSIT = 'DEPOSIT', WITHDRAWAL = 'WITHDRAWAL', PROMOTION = 'PROMOTION', KYC_UPDATE = 'KYC_UPDATE', SECURITY_ALERT = 'SECURITY_ALERT', SYSTEM = 'SYSTEM', RESPONSIBLE_GAMBLING = 'RESPONSIBLE_GAMBLING' }
export enum SupportTicketStatus { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', WAITING_USER = 'WAITING_USER', RESOLVED = 'RESOLVED', CLOSED = 'CLOSED' }
export enum RiskAlertSeverity { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', CRITICAL = 'CRITICAL' }
export enum AuditActionType { CREATE = 'CREATE', UPDATE = 'UPDATE', DELETE = 'DELETE', LOGIN = 'LOGIN', LOGOUT = 'LOGOUT', EXPORT = 'EXPORT', APPROVE = 'APPROVE', REJECT = 'REJECT', SUSPEND = 'SUSPEND', UNSUSPEND = 'UNSUSPEND' }
export enum ResponsibleGamblingLimitType { DEPOSIT_DAILY = 'DEPOSIT_DAILY', DEPOSIT_WEEKLY = 'DEPOSIT_WEEKLY', DEPOSIT_MONTHLY = 'DEPOSIT_MONTHLY', LOSS_DAILY = 'LOSS_DAILY', LOSS_WEEKLY = 'LOSS_WEEKLY', LOSS_MONTHLY = 'LOSS_MONTHLY', SESSION_MINUTES = 'SESSION_MINUTES', SELF_EXCLUSION = 'SELF_EXCLUSION', COOLING_OFF = 'COOLING_OFF' }
export enum Currency { USD = 'USD', EUR = 'EUR', GBP = 'GBP', NGN = 'NGN', KES = 'KES', ZAR = 'ZAR' }
export enum WsEventType { ODDS_UPDATE = 'ODDS_UPDATE', SCORE_UPDATE = 'SCORE_UPDATE', EVENT_STATUS = 'EVENT_STATUS', MARKET_SUSPENDED = 'MARKET_SUSPENDED', MARKET_OPENED = 'MARKET_OPENED', BET_UPDATE = 'BET_UPDATE', BALANCE_UPDATE = 'BALANCE_UPDATE', NOTIFICATION = 'NOTIFICATION' }

export interface User { id: string; email: string; username: string; phone?: string; role: UserRole; isEmailVerified: boolean; isPhoneVerified: boolean; isActive: boolean; isSuspended: boolean; mfaEnabled: boolean; kycStatus: KYCStatus; kycLevel: KYCLevel; createdAt: string; updatedAt: string }
export interface Wallet { id: string; userId: string; currency: Currency; balanceAvailable: number; balancePending: number; balanceBonus: number; balanceReserved: number; version: number; createdAt: string; updatedAt: string }
export interface Bet { id: string; userId: string; type: BetType; status: BetStatus; stake: number; totalOdds: number; potentialWinnings: number; actualWinnings?: number; currency: Currency; isLive: boolean; isCashedOut: boolean; cashOutAmount?: number; ipAddress: string; idempotencyKey: string; placedAt: string; settledAt?: string }
export interface BetSelection { id: string; betId: string; eventId: string; marketId: string; selectionId: string; oddsTaken: number; eventName: string; marketName: string; selectionName: string; status: BetStatus; settledAt?: string }