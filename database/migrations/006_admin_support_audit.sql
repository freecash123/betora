CREATE TYPE ticket_status AS ENUM ('OPEN','IN_PROGRESS','WAITING_USER','RESOLVED','CLOSED');
CREATE TYPE ticket_priority AS ENUM ('LOW','MEDIUM','HIGH','URGENT');
CREATE TYPE message_sender AS ENUM ('USER','AGENT');
CREATE TYPE alert_severity AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
CREATE TYPE admin_permission AS ENUM ('ADMIN_ACCESS','USER_MANAGE','USER_VIEW','KYC_MANAGE','KYC_VIEW','SPORTSBOOK_MANAGE','SPORTSBOOK_VIEW','BET_MANAGE','BET_SETTLE','BET_VIEW','WALLET_MANAGE','WALLET_VIEW','TRANSACTION_MANAGE','TRANSACTION_VIEW','PROMOTION_MANAGE','PROMOTION_VIEW','RISK_MANAGE','RISK_VIEW','SUPPORT_MANAGE','SUPPORT_VIEW','AUDIT_VIEW','AUDIT_EXPORT','REPORT_VIEW','REPORT_EXPORT','SETTINGS_MANAGE','SETTINGS_VIEW');
CREATE TYPE audit_action AS ENUM ('CREATE','UPDATE','DELETE','LOGIN','LOGOUT','EXPORT','APPROVE','REJECT','SUSPEND','UNSUSPEND');

CREATE TABLE support_tickets (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL REFERENCES users(id),subject VARCHAR(255) NOT NULL,status ticket_status NOT NULL DEFAULT 'OPEN',priority ticket_priority NOT NULL DEFAULT 'MEDIUM',assigned_to UUID REFERENCES users(id),category VARCHAR(50),last_reply_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE support_messages (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,sender_id UUID NOT NULL REFERENCES users(id),sender_type message_sender NOT NULL,content TEXT NOT NULL,attachments TEXT[],is_internal BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE risk_alerts (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID REFERENCES users(id),alert_type VARCHAR(50) NOT NULL,severity alert_severity NOT NULL DEFAULT 'LOW',description TEXT NOT NULL,is_resolved BOOLEAN NOT NULL DEFAULT FALSE,resolved_by UUID REFERENCES users(id),resolved_at TIMESTAMPTZ,resolution_notes TEXT,metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE exposure_limits (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),entity_type VARCHAR(20) NOT NULL CHECK(entity_type IN ('USER','EVENT','MARKET','SPORT')),entity_id UUID NOT NULL,max_exposure DECIMAL(12,2) NOT NULL,current_exposure DECIMAL(12,2) NOT NULL DEFAULT 0.00,is_active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE admin_users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL UNIQUE REFERENCES users(id),role user_role NOT NULL,permissions admin_permission[] NOT NULL DEFAULT '{}',is_active BOOLEAN NOT NULL DEFAULT TRUE,last_login_ip INET,last_login_at TIMESTAMPTZ,created_by UUID REFERENCES users(id),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE audit_logs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),admin_id UUID NOT NULL REFERENCES users(id),action audit_action NOT NULL,entity_type VARCHAR(50) NOT NULL,entity_id UUID,changes JSONB NOT NULL DEFAULT '{}',ip_address INET NOT NULL,user_agent TEXT,metadata JSONB DEFAULT '{}',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE login_history (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),user_id UUID NOT NULL REFERENCES users(id),ip_address INET NOT NULL,user_agent TEXT,is_successful BOOLEAN NOT NULL DEFAULT TRUE,failure_reason VARCHAR(50),location_city VARCHAR(100),location_country VARCHAR(2),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE app_settings (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),key VARCHAR(100) UNIQUE NOT NULL,value JSONB NOT NULL,description TEXT,updated_by UUID REFERENCES users(id),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_risk_alerts_user_id ON risk_alerts(user_id);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);