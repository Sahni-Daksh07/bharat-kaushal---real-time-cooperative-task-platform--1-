import { WorkerProfile, Booking, CooperativePolicy } from './index';

export type SuperAdminNavSection =
  | 'DASHBOARD'
  | 'IMPACT'
  | 'NATIONAL_MAP'
  | 'WORKFORCE'
  | 'SOCIETIES'
  | 'FEDERATIONS'
  | 'SERVICES'
  | 'BOOKINGS'
  | 'DISPATCH_INTEL'
  | 'FINANCE'
  | 'WELFARE'
  | 'SKILLS'
  | 'FORECASTING'
  | 'AI_INTEL'
  | 'FRAUD_RISK'
  | 'INTEGRATIONS'
  | 'AUDIT_LOGS'
  | 'POLICIES'
  | 'NOTIFICATIONS'
  | 'SYSTEM_HEALTH'
  | 'REPORTS'
  | 'SETTINGS';

export interface SuperAdminProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  designation: string;
  agency: string;
  role: 'SUPER_ADMIN';
  clearanceLevel: 'LEVEL_5_NATIONAL_APEX';
  mfaEnabled: boolean;
  station: string;
  lastLogin: string;
  ipAddress: string;
}

export interface StateWorkforceMetric {
  stateCode: string;
  stateName: string;
  capital: string;
  totalWorkers: number;
  verifiedWorkers: number;
  activeWorkers: number;
  availableWorkers: number;
  busyWorkers: number;
  monthlyRevenueInr: number;
  totalBookings: number;
  welfarePoolInr: number;
  societiesCount: number;
  federationName: string;
  demandIndex: number; // 0-100
  supplyIndex: number; // 0-100
  shortageSkills: string[];
  topTrade: string;
  womenParticipationRate: number; // e.g. 38%
  ruralReachRate: number; // e.g. 45%
  coordinates: { lat: number; lng: number };
}

export interface NationalFederationItem {
  id: string;
  name: string;
  code: string;
  level: 'NATIONAL' | 'STATE_APEX';
  jurisdiction: string;
  headquarters: string;
  president: string;
  directorPhone: string;
  directorEmail: string;
  societiesAffiliated: number;
  workersRepresented: number;
  totalEconomicTurnoverInr: number;
  performanceScore: number; // 0-100
  growthRateYoY: number; // percentage
  status: 'ACTIVE' | 'AUDIT_PENDING' | 'PROBATION';
}

export interface FraudSignal {
  id: string;
  category:
    | 'FAKE_WORKER'
    | 'DUPLICATE_IDENTITY'
    | 'SUSPICIOUS_PAYMENT'
    | 'RATING_MANIPULATION'
    | 'LOCATION_FRAUD'
    | 'BOOKING_ABUSE'
    | 'MASS_CANCELLATIONS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0-100
  targetType: 'WORKER' | 'CUSTOMER' | 'SOCIETY' | 'BOOKING';
  targetId: string;
  targetName: string;
  state: string;
  city: string;
  timestamp: string;
  reason: string;
  evidence: string[];
  recommendedAction: string;
  status: 'OPEN' | 'INVESTIGATING' | 'FLAGGED' | 'DISMISSED' | 'RESOLVED';
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module:
    | 'POLICY'
    | 'FINANCE'
    | 'ROLE_PERMISSIONS'
    | 'VERIFICATION'
    | 'WELFARE'
    | 'DISPATCH'
    | 'SECURITY'
    | 'SYSTEM_OVERRIDE';
  description: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL_SECURITY';
}

export interface SystemServiceHealth {
  name: string;
  category: 'API' | 'DATABASE' | 'QUEUE' | 'NOTIFICATIONS' | 'PAYMENTS' | 'STORAGE';
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimePercent: number;
  responseTimeMs: number;
  errorRatePercent: number;
  lastChecked: string;
  incidentsLast24h: number;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  description: string;
  agency: string;
  type: 'GOV_IDENTITY' | 'SKILL_COUNCIL' | 'INSURANCE' | 'PAYMENT' | 'TELECOM';
  status: 'CONNECTED' | 'SANDBOX' | 'INTEGRATION_READY' | 'NOT_CONNECTED';
  protocol: string;
  lastSyncTimestamp: string;
  recordsSyncedToday: number;
  uptime: number;
  certExpiry: string;
  docsUrl: string;
}

export interface SkillGapMetric {
  trade: string;
  category: string;
  activeWorkers: number;
  dailyDemandCount: number;
  gapPercentage: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorityRegions: string[];
  trainingModulesAvailable: number;
  certifiedLastQuarter: number;
}

export interface GovernmentImpactKPIs {
  workersDigitized: number;
  workersVerified: number;
  verificationRate: number;
  totalJobsCompleted: number;
  grossServiceValueInr: number;
  workerDirectIncomeInr: number;
  welfareCorpusInr: number;
  societyRevenueInr: number;
  womenParticipationPercent: number;
  ruralArtisanPercent: number;
  districtsCovered: number;
  statesActive: number;
  skillCertificationsIssued: number;
  directEmploymentHours: number;
  averageWorkerMonthlyIncomeInr: number;
  informalWageIncreasePercent: number;
  pensionInsuranceEnrolled: number;
}
