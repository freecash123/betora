CREATE TYPE event_status AS ENUM ('UPCOMING','LIVE','FINISHED','POSTPONED','CANCELLED','SUSPENDED');
CREATE TYPE market_status AS ENUM ('OPEN','SUSPENDED','CLOSED','SETTLED');

CREATE TABLE sports (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),name VARCHAR(100) NOT NULL,slug VARCHAR(50) UNIQUE NOT NULL,icon VARCHAR(10) NOT NULL,sort_order INTEGER NOT NULL DEFAULT 0,is_active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE competitions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,name VARCHAR(255) NOT NULL,slug VARCHAR(100) NOT NULL,country VARCHAR(2) NOT NULL,country_name VARCHAR(100),icon_url TEXT,sort_order INTEGER NOT NULL DEFAULT 0,is_active BOOLEAN NOT NULL DEFAULT TRUE,external_id VARCHAR(100),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(sport_id,slug));
CREATE TABLE leagues (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,name VARCHAR(255) NOT NULL,slug VARCHAR(100) NOT NULL,sort_order INTEGER NOT NULL DEFAULT 0,is_active BOOLEAN NOT NULL DEFAULT TRUE,external_id VARCHAR(100),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(competition_id,slug));
CREATE TABLE events (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),sport_id UUID NOT NULL REFERENCES sports(id),competition_id UUID NOT NULL REFERENCES competitions(id),league_id UUID REFERENCES leagues(id),home_team VARCHAR(255) NOT NULL,away_team VARCHAR(255) NOT NULL,start_time TIMESTAMPTZ NOT NULL,status event_status NOT NULL DEFAULT 'UPCOMING',home_score INTEGER,away_score INTEGER,clock VARCHAR(20),is_live BOOLEAN NOT NULL DEFAULT FALSE,stats JSONB DEFAULT '{}',external_id VARCHAR(100) UNIQUE,metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE markets (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,name VARCHAR(255) NOT NULL,market_type VARCHAR(50) NOT NULL,status market_status NOT NULL DEFAULT 'OPEN',sort_order INTEGER NOT NULL DEFAULT 0,external_id VARCHAR(100),metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE selections (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,name VARCHAR(255) NOT NULL,odds DECIMAL(10,3) NOT NULL,previous_odds DECIMAL(10,3),status market_status NOT NULL DEFAULT 'OPEN',sort_order INTEGER NOT NULL DEFAULT 0,result VARCHAR(20),external_id VARCHAR(100),metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE odds_history (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),selection_id UUID NOT NULL REFERENCES selections(id) ON DELETE CASCADE,odds DECIMAL(10,3) NOT NULL,recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE INDEX idx_events_sport_id ON events(sport_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_is_live ON events(is_live);
CREATE INDEX idx_markets_event_id ON markets(event_id);
CREATE INDEX idx_selections_market_id ON selections(market_id);

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_markets_updated_at BEFORE UPDATE ON markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_selections_updated_at BEFORE UPDATE ON selections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();