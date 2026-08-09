CREATE TYPE bet_type AS ENUM ('SINGLE','MULTIPLE','SYSTEM');
CREATE TYPE bet_status AS ENUM ('PENDING','WON','LOST','VOID','HALF_WON','HALF_LOST','CASHED_OUT','PENDING_SETTLEMENT');

CREATE TABLE bets (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL REFERENCES users(id),bet_ref VARCHAR(30) UNIQUE NOT NULL,type bet_type NOT NULL,status bet_status NOT NULL DEFAULT 'PENDING',stake DECIMAL(12,2) NOT NULL,total_odds DECIMAL(10,3) NOT NULL,potential_winnings DECIMAL(12,2) NOT NULL,actual_winnings DECIMAL(12,2),currency currency_type NOT NULL DEFAULT 'USD',is_live BOOLEAN NOT NULL DEFAULT FALSE,is_cashed_out BOOLEAN NOT NULL DEFAULT FALSE,cash_out_amount DECIMAL(12,2),cash_out_odds DECIMAL(10,3),ip_address INET NOT NULL,idempotency_key VARCHAR(100) UNIQUE NOT NULL,placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),settled_at TIMESTAMPTZ,cancelled_at TIMESTAMPTZ,cancel_reason TEXT,metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE bet_selections (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,event_id UUID NOT NULL REFERENCES events(id),market_id UUID NOT NULL REFERENCES markets(id),selection_id UUID NOT NULL REFERENCES selections(id),odds_taken DECIMAL(10,3) NOT NULL,event_name VARCHAR(255) NOT NULL,market_name VARCHAR(255) NOT NULL,selection_name VARCHAR(255) NOT NULL,home_team VARCHAR(255) NOT NULL,away_team VARCHAR(255) NOT NULL,status bet_status NOT NULL DEFAULT 'PENDING',settled_at TIMESTAMPTZ,result VARCHAR(20),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE bet_cash_out_offers (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,offer_amount DECIMAL(12,2) NOT NULL,offered_odds DECIMAL(10,3) NOT NULL,expires_at TIMESTAMPTZ NOT NULL,is_accepted BOOLEAN NOT NULL DEFAULT FALSE,accepted_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_placed_at ON bets(placed_at);
CREATE INDEX idx_bets_user_status ON bets(user_id,status);
CREATE INDEX idx_bets_idempotency ON bets(idempotency_key);
CREATE INDEX idx_bet_selections_bet_id ON bet_selections(bet_id);
CREATE INDEX idx_bet_selections_event_id ON bet_selections(event_id);

CREATE TRIGGER trg_bets_updated_at BEFORE UPDATE ON bets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();