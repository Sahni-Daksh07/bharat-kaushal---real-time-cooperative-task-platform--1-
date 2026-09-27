-- ============================================================================
-- BHARAT KAUSHAL COOPERATIVE PLATFORM - DATABASE SCHEMA
-- Operating under Madhya Pradesh Cooperative Societies Act, 1960
-- Compatible with PostgreSQL, SQLite, MySQL, Supabase & CockroachDB
-- ============================================================================

-- 1. SOCIETIES & COOPERATIVE BODIES
CREATE TABLE IF NOT EXISTS cooperative_societies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(128) NOT NULL UNIQUE,
    act_reference VARCHAR(128) DEFAULT 'MP Cooperative Societies Act, 1960',
    district VARCHAR(64) DEFAULT 'Indore',
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    registered_office_address TEXT,
    operations_fee_percent DECIMAL(5, 2) DEFAULT 3.50,
    welfare_levy_percent DECIMAL(5, 2) DEFAULT 2.00,
    active_artisans_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS (CITIZENS / CUSTOMERS)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    role VARCHAR(32) DEFAULT 'CUSTOMER',
    address_line TEXT,
    ward VARCHAR(64),
    district VARCHAR(64) DEFAULT 'Indore',
    city VARCHAR(64) DEFAULT 'Indore',
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    pincode VARCHAR(10) DEFAULT '452001',
    latitude DECIMAL(10, 7) DEFAULT 22.7196,
    longitude DECIMAL(10, 7) DEFAULT 75.8577,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. WORKERS / SKILLED ARTISANS
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    society_id VARCHAR(64) REFERENCES cooperative_societies(id) ON DELETE SET NULL,
    primary_trade VARCHAR(64) NOT NULL,
    secondary_trades TEXT[],
    experience_years INT DEFAULT 1,
    aadhaar_masked VARCHAR(20),
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    verification_level VARCHAR(32) DEFAULT 'COMMUNITY_VOUCHED',
    trust_score INT DEFAULT 85,
    completed_jobs INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 4.90,
    is_available BOOLEAN DEFAULT TRUE,
    daily_capacity INT DEFAULT 4,
    latitude DECIMAL(10, 7) DEFAULT 22.7196,
    longitude DECIMAL(10, 7) DEFAULT 75.8577,
    bank_account_masked VARCHAR(32),
    upi_vpa VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SERVICE CATALOG (146 STANDARDIZED RATES IN INDORE)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(64) PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    pricing_unit VARCHAR(64) NOT NULL,
    min_price_inr DECIMAL(10, 2) NOT NULL,
    max_price_inr DECIMAL(10, 2),
    suggested_display_price_inr DECIMAL(10, 2) NOT NULL,
    artisan_payout_rate DECIMAL(5, 2) DEFAULT 94.50,
    society_admin_rate DECIMAL(5, 2) DEFAULT 3.50,
    welfare_fund_rate DECIMAL(5, 2) DEFAULT 2.00,
    estimated_duration_hours DECIMAL(4, 2) DEFAULT 1.0,
    notes TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SERVICE BOOKINGS & TASK DISPATCH
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id VARCHAR(64) REFERENCES workers(id) ON DELETE SET NULL,
    service_id VARCHAR(64) NOT NULL REFERENCES services(id),
    status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED', 
    -- Statuses: REQUESTED, MATCHING, ACCEPTED, EN_ROUTE, IN_PROGRESS, COMPLETED, CANCELLED
    doorstep_arrival_otp VARCHAR(6),
    job_completion_otp VARCHAR(6),
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    labor_rate_benchmark DECIMAL(10, 2) NOT NULL,
    material_cost_actual DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    location_address TEXT NOT NULL,
    ward VARCHAR(64),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    resident_notes TEXT,
    customer_rating INT,
    customer_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. STATUTORY FINANCIAL LEDGER (94.5% / 3.5% / 2.0% SPLIT)
CREATE TABLE IF NOT EXISTS financial_ledger (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    worker_id VARCHAR(64) NOT NULL REFERENCES workers(id),
    total_paid_inr DECIMAL(10, 2) NOT NULL,
    worker_realization_inr DECIMAL(10, 2) NOT NULL, -- 94.5%
    society_admin_fee_inr DECIMAL(10, 2) NOT NULL,   -- 3.5%
    welfare_fund_levy_inr DECIMAL(10, 2) NOT NULL,   -- 2.0%
    settlement_status VARCHAR(32) DEFAULT 'SETTLED',  -- PENDING, SETTLED, DISPUTED
    payment_mode VARCHAR(32) DEFAULT 'UPI',
    utr_transaction_ref VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MP LABOUR WELFARE FUND POOL
CREATE TABLE IF NOT EXISTS welfare_fund_ledger (
    id VARCHAR(64) PRIMARY KEY,
    source_booking_id VARCHAR(64) REFERENCES bookings(id),
    worker_id VARCHAR(64) REFERENCES workers(id),
    amount_inr DECIMAL(10, 2) NOT NULL,
    fund_name VARCHAR(128) DEFAULT 'MP Unorganized Workers Social Security Fund',
    transaction_type VARCHAR(32) DEFAULT 'ACCRUAL', -- ACCRUAL, DISBURSEMENT, MEDICAL_GRANT, ACCIDENT_INSURANCE
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. COMPLAINTS & GRIEVANCE REDRESSAL
CREATE TABLE IF NOT EXISTS grievance_tickets (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) REFERENCES bookings(id),
    filed_by_user_id VARCHAR(64) REFERENCES users(id),
    against_worker_id VARCHAR(64) REFERENCES workers(id),
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'OPEN', -- OPEN, IN_REVIEW, MEDIATED, RESOLVED, DISMISSED
    resolution_notes TEXT,
    arbitrated_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- INDEXES FOR FAST CIVIC DISPATCH & REPORTING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_workers_trade_loc ON workers (primary_trade, is_available);
CREATE INDEX IF NOT EXISTS idx_services_category ON services (category, is_popular);
CREATE INDEX IF NOT EXISTS idx_bookings_status_customer ON bookings (customer_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON bookings (worker_id, status);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_booking ON financial_ledger (booking_id);
CREATE INDEX IF NOT EXISTS idx_welfare_worker ON welfare_fund_ledger (worker_id);
