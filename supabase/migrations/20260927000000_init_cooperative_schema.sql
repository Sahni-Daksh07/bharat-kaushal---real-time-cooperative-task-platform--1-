-- ============================================================================
-- BHARAT KAUSHAL COOPERATIVE PLATFORM - PRODUCTION DATABASE SCHEMA
-- Operating under Madhya Pradesh Cooperative Societies Act, 1960
-- Compatible with PostgreSQL 15+, Supabase Cloud & Local CLI
-- ============================================================================

-- 1. SOCIETIES
CREATE TABLE IF NOT EXISTS societies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    city VARCHAR(64) DEFAULT 'Indore',
    district VARCHAR(64) DEFAULT 'Indore',
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    federation_id VARCHAR(64)
);

-- 2. SERVICES (146 STANDARDIZED MUNICIPAL RATES)
CREATE TABLE IF NOT EXISTS services (
    record_id VARCHAR(64) PRIMARY KEY,
    city VARCHAR(64) DEFAULT 'Indore',
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    currency VARCHAR(10) DEFAULT 'INR',
    category VARCHAR(64) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    pricing_unit VARCHAR(64) NOT NULL,
    min_price_inr DECIMAL(10, 2) NOT NULL,
    max_price_inr DECIMAL(10, 2),
    suggested_display_price_inr DECIMAL(10, 2) NOT NULL,
    price_type VARCHAR(64) DEFAULT 'Indicative',
    materials_or_parts_included BOOLEAN DEFAULT FALSE,
    notes TEXT,
    estimated_duration_hours DECIMAL(4, 2) DEFAULT 1.0,
    worker_requirement_type VARCHAR(64) DEFAULT 'SINGLE_WORKER',
    pricing_model VARCHAR(64) DEFAULT 'PER_JOB',
    minimum_workers INT DEFAULT 1,
    recommended_workers INT DEFAULT 1,
    team_roles JSONB,
    worker_requirement_rules JSONB
);

-- 3. WORKERS (CERTIFIED MEMBER ARTISANS)
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    gender VARCHAR(16) DEFAULT 'MALE',
    dob DATE DEFAULT '1990-01-01',
    address TEXT,
    city VARCHAR(64) DEFAULT 'Indore',
    district VARCHAR(64) DEFAULT 'Indore',
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    pin_code VARCHAR(10) DEFAULT '452001',
    society_id VARCHAR(64) REFERENCES societies(id) ON DELETE SET NULL,
    primary_trade VARCHAR(64) NOT NULL,
    skill_assessment_score INT DEFAULT 85,
    skill_level VARCHAR(32) DEFAULT 'SKILLED',
    verification_status VARCHAR(32) DEFAULT 'VERIFIED',
    rejection_reason TEXT,
    availability VARCHAR(32) DEFAULT 'AVAILABLE',
    rating DECIMAL(3, 2) DEFAULT 4.90,
    total_ratings_count INT DEFAULT 1,
    completed_jobs INT DEFAULT 0,
    failed_jobs INT DEFAULT 0,
    consecutive_failures INT DEFAULT 0,
    penalty_status VARCHAR(32) DEFAULT 'CLEAN',
    earnings_today DECIMAL(10, 2) DEFAULT 0.00,
    earnings_week DECIMAL(10, 2) DEFAULT 0.00,
    earnings_month DECIMAL(10, 2) DEFAULT 0.00,
    earnings_total DECIMAL(10, 2) DEFAULT 0.00,
    trust_score INT DEFAULT 85,
    reliability_score INT DEFAULT 90,
    current_lat DECIMAL(10, 7) DEFAULT 22.7196,
    current_lng DECIMAL(10, 7) DEFAULT 75.8577,
    masked_aadhaar VARCHAR(20),
    masked_pan VARCHAR(20),
    welfare_balance DECIMAL(10, 2) DEFAULT 0.00,
    uan_number VARCHAR(32),
    upi_id VARCHAR(128),
    bank_account VARCHAR(32),
    ifsc VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CUSTOMERS (CITIZENS & RESIDENTS)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    photo_url TEXT,
    citizen_aadhaar_masked VARCHAR(20),
    consecutive_cancellations INT DEFAULT 0,
    penalty_status VARCHAR(32) DEFAULT 'CLEAN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SOCIETY ADMINS
CREATE TABLE IF NOT EXISTS society_admins (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    society_id VARCHAR(64) REFERENCES societies(id) ON DELETE SET NULL,
    designation VARCHAR(128),
    dsc_certificate_serial VARCHAR(128),
    registered_jurisdiction VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. FEDERATION ADMINS
CREATE TABLE IF NOT EXISTS federation_admins (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    department VARCHAR(128),
    clearance_level VARCHAR(64),
    official_designation VARCHAR(128),
    station VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SUPER ADMINS (GOVERNMENT REGULATORS)
CREATE TABLE IF NOT EXISTS super_admins (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    ministry VARCHAR(128),
    department VARCHAR(128),
    official_designation VARCHAR(128),
    cadre VARCHAR(64),
    clearance_level VARCHAR(64),
    mfa_method VARCHAR(32) DEFAULT 'TOTP',
    token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    worker_id VARCHAR(64) REFERENCES workers(id) ON DELETE SET NULL,
    service_id VARCHAR(64) REFERENCES services(record_id) ON DELETE RESTRICT,
    customer_address_id VARCHAR(64),
    status VARCHAR(32) DEFAULT 'REQUESTED',
    base_labour DECIMAL(10, 2) DEFAULT 0.00,
    travel_charge DECIMAL(10, 2) DEFAULT 0.00,
    urgency_charge DECIMAL(10, 2) DEFAULT 0.00,
    materials_total DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    gross_amount DECIMAL(10, 2) NOT NULL,
    worker_share DECIMAL(10, 2) NOT NULL,
    society_share DECIMAL(10, 2) NOT NULL,
    welfare_share DECIMAL(10, 2) NOT NULL,
    net_payable DECIMAL(10, 2) NOT NULL,
    arrival_otp VARCHAR(6),
    completion_otp VARCHAR(6),
    worker_lat DECIMAL(10, 7),
    worker_lng DECIMAL(10, 7),
    distance_km DECIMAL(6, 2),
    eta_minutes INT,
    search_radius_km DECIMAL(6, 2),
    dispatch_log JSONB,
    cancellation_reason TEXT,
    cancellation_penalty DECIMAL(10, 2) DEFAULT 0.00,
    cancelled_by VARCHAR(64),
    team_required BOOLEAN DEFAULT FALSE,
    team_size INT DEFAULT 1,
    worker_requirement_type VARCHAR(64) DEFAULT 'SINGLE_WORKER',
    scope_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- 9. FINANCIAL LEDGER (94.5% / 3.5% / 2.0% SPLIT)
CREATE TABLE IF NOT EXISTS financial_ledger (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) REFERENCES bookings(id) ON DELETE CASCADE,
    customer_paid DECIMAL(10, 2) NOT NULL,
    worker_credit DECIMAL(10, 2) NOT NULL,
    society_credit DECIMAL(10, 2) NOT NULL,
    welfare_credit DECIMAL(10, 2) NOT NULL,
    policy_snapshot VARCHAR(255),
    status VARCHAR(32) DEFAULT 'CAPTURED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. WELFARE RECORDS (MP SOCIAL SECURITY FUND CONTRIBUTIONS)
CREATE TABLE IF NOT EXISTS welfare_records (
    id VARCHAR(64) PRIMARY KEY,
    worker_id VARCHAR(64) REFERENCES workers(id) ON DELETE SET NULL,
    booking_id VARCHAR(64) REFERENCES bookings(id) ON DELETE SET NULL,
    contribution_amount DECIMAL(10, 2) NOT NULL,
    scheme VARCHAR(255) DEFAULT 'MP Unorganized Workers Social Security Fund',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. COOPERATIVE POLICY
CREATE TABLE IF NOT EXISTS cooperative_policy (
    id VARCHAR(64) PRIMARY KEY,
    active_model VARCHAR(32) DEFAULT 'MODEL_A',
    model_a_worker_percent DECIMAL(5, 2) DEFAULT 94.50,
    model_a_society_percent DECIMAL(5, 2) DEFAULT 3.50,
    model_a_welfare_percent DECIMAL(5, 2) DEFAULT 2.00,
    model_b_worker_percent DECIMAL(5, 2) DEFAULT 92.00,
    model_b_maintenance_percent DECIMAL(5, 2) DEFAULT 5.00,
    model_b_welfare_percent DECIMAL(5, 2) DEFAULT 3.00,
    grace_window_minutes INT DEFAULT 15,
    unexcused_penalty_inr DECIMAL(10, 2) DEFAULT 100.00,
    three_strike_deduction_percent DECIMAL(5, 2) DEFAULT 5.00,
    customer_cancel_fee_inr DECIMAL(10, 2) DEFAULT 50.00,
    standard_radius_km DECIMAL(6, 2) DEFAULT 5.00,
    emergency_radius_km DECIMAL(6, 2) DEFAULT 8.00,
    max_radius_km DECIMAL(6, 2) DEFAULT 12.00
);

-- ============================================================================
-- INDEXES FOR FAST PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);
CREATE INDEX IF NOT EXISTS idx_workers_trade ON workers (primary_trade, availability);
CREATE INDEX IF NOT EXISTS idx_workers_society ON workers (society_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON bookings (worker_id);
CREATE INDEX IF NOT EXISTS idx_ledger_booking ON financial_ledger (booking_id);
CREATE INDEX IF NOT EXISTS idx_welfare_worker ON welfare_records (worker_id);
