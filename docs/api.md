# BETORA API Documentation

## Base URL: `/api/v1`

### Auth
- `POST /auth/register` — Register (email, username, password, firstName, lastName, dateOfBirth, country)
- `POST /auth/login` — Login returns `{accessToken, refreshToken, user}`
- `POST /auth/mfa/verify` — Verify MFA token
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Invalidate session (requires auth)
- `POST /auth/change-password` — Change password (requires auth)
- `GET /auth/me` — Current user (requires auth)

### Sportsbook
- `GET /sportsbook/sports` — List sports
- `GET /sportsbook/events?status=LIVE&search=team` — Query events
- `GET /sportsbook/events/:id` — Single event
- `GET /sportsbook/live` — Live events
- `GET /sportsbook/popular` — Popular events

### Betting (requires auth)
- `POST /betting/place` — Place bet `{type,stake,selections:[{selectionId,odds}]}`
- `GET /betting/bets?status=PENDING` — User's bets
- `GET /betting/bets/:id` — Bet detail
- `POST /betting/cash-out/:id` — Cash out

### Wallet (requires auth)
- `GET /wallet` — Balance
- `GET /wallet/transactions` — History
- `GET /wallet/ledger` — Double-entry ledger
- `POST /wallet/deposit` — Deposit
- `POST /wallet/withdraw` — Withdraw

### WebSocket (`/betora`)
Events: ODDS_UPDATE, SCORE_UPDATE, EVENT_STATUS, MARKET_SUSPENDED, MARKET_OPENED, BET_UPDATE, BALANCE_UPDATE, NOTIFICATION