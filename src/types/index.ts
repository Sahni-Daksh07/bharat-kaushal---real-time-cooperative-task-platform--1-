export type UserRole =
  | 'CUSTOMER'
  | 'WORKER'
  | 'SOCIETY_ADMIN'
  | 'FEDERATION_ADMIN'
  | 'SUPER_ADMIN';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
export type SkillLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
  landmark?: string;
}

export interface WorkerSkill {
  name: string;
  isPrimary: boolean;
  yearsExperience: number;
  description?: string;
}

export interface TrustScoreBreakdown {
  identityScore: number; // Max 20
  societyScore: number;  // Max 15
  skillScore: number;    // Max 20
  experienceScore: number; // Max 10
  performanceScore: number; // Max 15
  ratingScore: number;   // Max 10
  reliabilityScore: number; // Max 10
  total: number;         // 0-100
  notes: string[];
}

export interface WorkerAddressInfo {
  address: string;
  line1?: string;
  locality?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
}

export interface WorkerProfile {
  id: string; // e.g., BH-KAUSHAL-WKR-000124
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  photoUrl?: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  permanentAddress?: WorkerAddressInfo;
  temporaryAddress?: WorkerAddressInfo;
  societyId: string;
  societyName: string;
  skills: WorkerSkill[];
  primaryTrade: string;
  skillAssessmentScore: number; // 0-100
  skillLevel: SkillLevel;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  availability: boolean;
  rating: number;
  totalRatingsCount: number;
  completedJobs: number;
  failedJobs: number;
  consecutiveFailures: number;
  penaltyStatus: 'NONE' | 'WARNING' | 'PENALTY_30_PERCENT';
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  trustScore: number; // 0-100
  trustBreakdown: TrustScoreBreakdown;
  reliabilityScore: number; // 0-100%
  currentLocation: LocationCoordinates;
  maskedAadhaar: string; // e.g., "XXXX XXXX 4521"
  aadhaarNumber?: string;
  aadhaarDocUrl?: string;
  maskedPan: string;     // e.g., "XXXXX1234X"
  documents: {
    aadhaarUploaded: boolean;
    panUploaded: boolean;
    licenseUploaded?: boolean;
    certUploaded?: boolean;
    aadhaarDocUrl?: string;
  };
  paymentSetup: {
    upiId: string;
    bankAccount: string;
    ifsc: string;
    method: string;
  };
  welfareBalance: number;
  uanNumber?: string;
  bankDetails?: any;
  detectedField?: string;
  fieldConfidence?: number;
  detectionRationale?: string;
  workDescription?: string;
  preferredLanguage?: string;
  verifiedSkills?: string[];
  registeredSkills?: string[];
  assessmentStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  assessmentHistory?: Array<{
    date: string;
    score: number;
    total: number;
    percentage: number;
    level: string;
    trade: string;
    categoryBreakdown?: Record<string, any>;
  }>;
  matchedKeywords?: string[];
  experienceYears?: number;
  consentGiven?: boolean;
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  address: string;
  line1?: string;
  locality?: string;
  landmark?: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  pinCode: string;
  pincode?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  photoUrl?: string;
  citizenAadhaarMasked?: string;
  addresses: CustomerAddress[];
  consecutiveCancellations: number;
  penaltyStatus: 'NONE' | 'PENALTY_50_INR';
  createdAt: string;
}

export interface SocietyAdminProfile {
  id: string; // e.g. ADM-IND-02-77
  name: string;
  phone: string;
  email: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  societyId: string;
  societyName: string;
  designation: string;
  role: 'SOCIETY_ADMIN';
  dscCertificateSerial: string; // Digital Signature Token
  registeredJurisdiction: string;
  createdAt: string;
}

export interface FederationAdminProfile {
  id: string; // e.g. FED-DIR-MP-001
  name: string;
  phone: string;
  email: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  department: string;
  clearanceLevel: 'LEVEL_4_EXECUTIVE' | 'LEVEL_3_DIRECTOR' | 'LEVEL_2_IMC_COMMAND';
  role: 'FEDERATION_ADMIN';
  officialDesignation: string;
  station: string;
  createdAt: string;
}

export interface SuperAdminProfile {
  id: string; // e.g. GOV-MOL-JS-001
  name: string;
  phone: string;
  email: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  ministry: string;
  department: string;
  officialDesignation: string;
  cadre: string;
  clearanceLevel: 'APEX_LEVEL_5_NATIONAL' | 'LEVEL_4_MINISTERIAL' | 'LEVEL_3_REGULATORY';
  role: 'SUPER_ADMIN';
  mfaMethod: 'AADHAAR_TOTP' | 'HARDWARE_KEY' | 'OFFICIAL_OTP';
  tokenExpiresAt: string;
  createdAt: string;
}

export interface EmailVerificationState {
  email: string;
  isVerified: boolean;
  verifiedAt?: string;
  pendingOtp?: string;
}

export interface AuthSession<T> {
  isAuthenticated: boolean;
  user: T | null;
  token?: string;
  lastLogin?: string;
}

export type WorkerRequirementType =
  | 'SINGLE_WORKER'
  | 'MULTI_WORKER_CONDITIONAL'
  | 'MULTI_WORKER_COMPULSORY';

export type ServicePricingModel =
  | 'PER_JOB'
  | 'PER_WORKER'
  | 'PER_DAY_PER_WORKER'
  | 'PER_UNIT'
  | 'PER_SQFT';

export interface WorkerRequirementRule {
  id: string;
  name: string;
  conditionDescription: string;
  minWorkers: number;
  recommendedWorkers: number;
  reason: string;
  criteria?: {
    propertyTypes?: string[];
    minAreaSqFt?: number;
    minFloors?: number;
    minUnits?: number;
    treatmentTypes?: string[];
    scopeKeywords?: string[];
    difficultAccess?: boolean;
    wallBreaking?: boolean;
    postConstruction?: boolean;
  };
}

export interface BookingWorker {
  id: string;
  workerName: string;
  phone: string;
  role: string;
  isLead: boolean;
  rating: number;
  trade: string;
  trustScore: number;
  status: 'ASSIGNED' | 'ACCEPTED' | 'TRAVELLING' | 'ARRIVED' | 'REJECTED';
  assignedAt: string;
  acceptedAt?: string;
}

export interface BookingScopeDetails {
  propertyType?: string;
  areaSqFt?: number;
  floorsCount?: number;
  treatmentType?: string;
  unitsCount?: number;
  wallBreaking?: boolean;
  highAccessRopeNeeded?: boolean;
  postConstruction?: boolean;
  additionalNotes?: string;
  customWorkerCount?: number;
}

export interface WorkerRequirementResult {
  minimum_workers: number;
  recommended_workers: number;
  selected_workers: number;
  worker_requirement_type: WorkerRequirementType;
  pricing_model: ServicePricingModel;
  reason: string;
  team_roles: string[];
  scope_breakdown?: string;
  applied_rule_id?: string;
}

export interface ServiceItem {
  record_id: string;
  city: string;
  state: string;
  currency: string;
  category: string;
  service_name: string;
  pricing_unit: string;
  min_price_inr: number;
  max_price_inr: number;
  suggested_display_price_inr: number;
  price_type: string;
  materials_or_parts_included: string;
  notes: string;
  data_status: string;
  estimated_duration_hours?: number;
  typical_demand?: string;
  popular?: boolean;
  urgent?: boolean;
  icon?: string;

  // Dynamic Multi-Worker Configuration
  minimum_workers?: number;
  recommended_workers?: number;
  worker_requirement_type?: WorkerRequirementType;
  pricing_model?: ServicePricingModel;
  team_roles?: string[];
  worker_requirement_rules?: WorkerRequirementRule[];
}

export interface AssessmentQuestion {
  id: number;
  trade: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: string;
}

export type BookingStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'MATCHING'
  | 'WORKER_OFFERED'
  | 'WORKER_DISPATCHED'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'TRAVELLING'
  | 'ARRIVED'
  | 'ARRIVAL_OTP_VERIFIED'
  | 'IN_PROGRESS'
  | 'MATERIAL_REVIEW'
  | 'COMPLETION_PENDING'
  | 'COMPLETION_OTP_VERIFIED'
  | 'CUSTOMER_CONFIRMED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'SETTLED'
  | 'RATED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REASSIGNING'
  | 'DISPUTED'
  | 'NO_SHOW';

export interface BookingMaterial {
  id: string;
  name: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
}

export interface BookingPriceBreakdown {
  baseLabour: number;
  travelCharge: number;
  urgencyCharge: number;
  materialsTotal: number;
  tax: number;
  discount: number;
  grossAmount: number;
  workerShare: number;
  societyShare: number;
  welfareShare: number;
  netPayable: number;
}

export type PaymentMethodType = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';

export interface PaymentDetails {
  transactionId: string;
  utrNumber?: string;
  method: PaymentMethodType;
  methodLabel: string;
  paidAmount: number;
  paidAt: string;
  reconciledAt: string;
  invoiceNumber: string;
  cashTendered?: number;
  cashChangeReturned?: number;
  reconciliationStatus: 'RECONCILED' | 'PENDING';
  digitalCardLast4?: string;
  cardBrand?: string;
  upiVpa?: string;
  notes?: string;
}

export interface Booking {
  id: string; // e.g., SS-1042
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: CustomerAddress;
  serviceId: string;
  serviceName: string;
  category: string;
  status: BookingStatus;
  workerId?: string;
  workerName?: string;
  workerPhone?: string;
  workerTrade?: string;
  workerRating?: number;
  workerTrustScore?: number;
  pricing: BookingPriceBreakdown;
  materials: BookingMaterial[];
  arrivalOtp?: string;
  completionOtp?: string;
  workerLocation?: {
    lat: number;
    lng: number;
    distanceKm: number;
    etaMinutes: number;
    lastUpdated: string;
  };
  searchRadiusKm?: number;
  dispatchLog?: string[];
  cancellationReason?: string;
  cancellationPenalty?: number;
  cancelledBy?: 'WORKER' | 'CUSTOMER' | 'SYSTEM';
  paymentStatus?: 'PENDING' | 'PAID';
  paymentMethod?: string;
  paymentDetails?: PaymentDetails;
  invoiceNumber?: string;
  rating?: {
    stars: number;
    quality: number;
    punctuality: number;
    behaviour: number;
    feedback?: string;
    createdAt: string;
  };
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  paidAt?: string;

  // Multi-Worker Team Fields
  teamRequired?: boolean;
  teamSize?: number;
  teamMembers?: BookingWorker[];
  workerRequirementType?: WorkerRequirementType;
  workerRequirementDetails?: WorkerRequirementResult;
  scopeDetails?: BookingScopeDetails;
}

export interface CooperativePolicy {
  activeModel: 'MODEL_A' | 'MODEL_B'; // Model A = Society Cooperative, Model B = Platform
  modelA: {
    workerSharePercent: number; // 94.5%
    societySharePercent: number; // 3.5%
    welfareFundPercent: number; // 2.0%
  };
  modelB: {
    workerSharePercent: number; // 95.0%
    maintenancePercent: number; // 2.5%
    welfareFundPercent: number; // 2.5%
  };
  cancellationPolicy: {
    graceWindowMinutes: number; // 5 min
    unexcusedPenaltyInr: number; // ₹20
    threeStrikeConsecutiveFailureDeductionPercent: number; // 30%
    threeStrikeCustomerCancellationFeeInr: number; // ₹50
  };
  dispatchPolicy: {
    standardInitialRadiusKm: number; // 5 km
    emergencyInitialRadiusKm: number; // 3 km
    standardExpansionStepKm: number; // 1 km
    maxRadiusKm: number; // 20 km
    weights: {
      skillMatch: number; // 25
      distanceEta: number; // 20
      reliability: number; // 15
      qualityRating: number; // 15
      experience: number; // 10
      workload: number; // 10
      fairness: number; // 5
    };
  };
}

export interface FinancialLedgerEntry {
  id: string;
  bookingId: string;
  customerPaid: number;
  workerCredit: number;
  societyCredit: number;
  welfareCredit: number;
  policySnapshot: string;
  status: 'PENDING' | 'CAPTURED' | 'SETTLED' | 'RECONCILED';
  timestamp: string;
}

export interface WelfareRecord {
  id: string;
  workerId: string;
  workerName: string;
  bookingId: string;
  contributionAmount: number;
  timestamp: string;
  scheme: string;
}

export interface SupportComplaint {
  id: string; // e.g. CMP-2026-001245
  bookingId?: string;
  userType: 'CUSTOMER' | 'WORKER';
  userId: string;
  userName: string;
  category: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'RESOLVED' | 'CLOSED';
  assignedAuthority?: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerAppeal {
  id: string;
  workerId: string;
  workerName: string;
  bookingId: string;
  penaltyAmount: number;
  reason: string;
  category: 'MEDICAL' | 'VEHICLE_BREAKDOWN' | 'SEVERE_WEATHER' | 'UNSAFE_SITE' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminRemarks?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface RealtimeEventPayload {
  event: string;
  timestamp: string;
  data: any;
  message?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  targetRole?: UserRole | 'ALL';
  targetUserId?: string;
  bookingId?: string;
  createdAt: string;
  read: boolean;
}
