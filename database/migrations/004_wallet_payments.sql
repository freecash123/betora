CREATE TYPE transaction_type AS ENUM ('DEPOSIT','WITHDRAWAL','BET_PLACED','BET_WON','BET_REFUND','BONUS_CREDIT','BONUS_DEBIT','ADJUSTMENT','CASHOUT');
CREATE TYPE transaction_status AS ENUM ('PENDING','COMPLETED','FAILED','CANCELLED','REVERSED');
CREATE TYPE payment_method_type AS ENUM ('CARD','BANK_TRANSFER','E_WALLET','LOCAL_PAYMENT','CRYPTO');

CREATE TABLE wallets (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL UNIQUE REFERENCES users(id),currency currency_type NOT NULL DEFAULT 'USD',balance_available DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK(balance_available>=0),balance_pending DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK(balance_pending>=0),balance_bonus DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK(balance_bonus>=0),balance_reserved DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK(balance_reserved>=0),version INTEGER NOT NULL DEFAULT 1,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE ledger_entries (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),wallet_id UUID NOT NULL REFERENCES wallets(id),user_id UUID NOT NULL REFERENCES users(id),transaction_id UUID NOT NULL,entry_type VARCHAR(10) NOT NULL CHECK(entry_type IN ('DEBIT','CREDIT')),amount DECIMAL(12,2) NOT NULL CHECK(amount>0),balance_before DECIMAL(12,2) NOT NULL,balance_after DECIMAL(12,2) NOT NULL,reference VARCHAR(255) NOT NULL,description TEXT,metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE transactions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL REFERENCES users(id),wallet_id UUID NOT NULL REFERENCES wallets(id),transaction_ref VARCHAR(50) UNIQUE NOT NULL,amount DECIMAL(12,2) NOT NULL,currency currency_type NOT NULL DEFAULT 'USD',type transaction_type NOT NULL,status transaction_status NOT NULL DEFAULT 'PENDING',payment_provider VARCHAR(50),payment_reference VARCHAR(255),payment_method_id UUID,bet_id UUID REFERENCES bets(id),idempotency_key VARCHAR(100) UNIQUE NOT NULL,fee_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,metadata JSONB DEFAULT '{}',completed_at TIMESTAMPTZ,failed_at TIMESTAMPTZ,failure_reason TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE payment_methods (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,type payment_method_type NOT NULL,provider VARCHAR(50) NOT NULL,token VARCHAR(255),last_four VARCHAR(4),expiry_month VARCHAR(2),expiry_year VARCHAR(4),card_brand VARCHAR(20),bank_name VARCHAR(255),is_default BOOLEAN NOT NULL DEFAULT FALSE,is_verified BOOLEAN NOT NULL DEFAULT FALSE,metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE deposits (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),transaction_id UUID NOT NULL UNIQUE REFERENCES transactions(id),user_id UUID NOT NULL REFERENCES users(id),amount DECIMAL(12,2) NOT NULL,currency currency_type NOT NULL,payment_method_id UUID NOT NULL,provider VARCHAR(50) NOT NULL,provider_reference VARCHAR(255),provider_status VARCHAR(50),redirect_url TEXT,callback_data JSONB DEFAULT '{}',expires_at TIMESTAMPTZ,completed_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE withdrawals (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),transaction_id UUID NOT NULL UNIQUE REFERENCES transactions(id),user_id UUID NOT NULL REFERENCES users(id),amount DECIMAL(12,2) NOT NULL,currency currency_type NOT NULL,payment_method_id UUID NOT NULL,provider VARCHAR(50) NOT NULL,provider_reference VARCHAR(255),provider_status VARCHAR(50),is_processed BOOLEAN NOT NULL DEFAULT FALSE,processed_at TIMESTAMPTZ,notes TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE payment_webhooks (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),provider VARCHAR(50) NOT NULL,event_type VARCHAR(100) NOT NULL,payload JSONB NOT NULL,signature VARCHAR(255),is_verified BOOLEAN NOT NULL DEFAULT FALSE,is_processed BOOLEAN NOT NULL DEFAULT FALSE,processed_at TIMESTAMPTZ,idempotency_key VARCHAR(100) UNIQUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_ledger_wallet_id ON ledger_entries(wallet_id);
CREATE INDEX idx_ledger_user_id ON ledger_entries(user_id);
CREATE INDEX idx_ledger_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_idempotency ON transactions(idempotency_key);

CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();