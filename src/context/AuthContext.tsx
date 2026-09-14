import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CustomerProfile,
  WorkerProfile,
  SocietyAdminProfile,
  FederationAdminProfile,
  SuperAdminProfile,
  UserRole,
} from '../types';
import {
  SEEDED_CUSTOMERS,
  PRIMARY_DEMO_WORKER,
  SEEDED_WORKERS,
  SEEDED_SOCIETY_ADMINS,
  SEEDED_FEDERATION_ADMINS,
  SEEDED_SUPER_ADMINS,
} from '../data/seedData';

interface AuthContextType {
  // Customer Auth
  customerUser: CustomerProfile | null;
  isCustomerAuthenticated: boolean;
  loginCustomer: (params: { phone?: string; customerId?: string; email?: string; otp?: string }) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (data: { name: string; phone: string; email?: string; address?: string; locality?: string; landmark?: string; pinCode?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutCustomer: () => void;
  switchCustomer: (customer: CustomerProfile) => void;

  // Worker Auth
  workerUser: WorkerProfile | null;
  isWorkerAuthenticated: boolean;
  loginWorker: (params: { workerId?: string; phone?: string; uan?: string; pin?: string }) => Promise<{ success: boolean; message?: string }>;
  registerWorker: (data: Partial<WorkerProfile> & { experienceYears?: number; aadhaar?: string; upiId?: string }) => Promise<{ success: boolean; message?: string; worker?: WorkerProfile }>;
  logoutWorker: () => void;
  switchWorker: (worker: WorkerProfile) => void;

  // Society Admin Auth
  societyAdminUser: SocietyAdminProfile | null;
  isSocietyAdminAuthenticated: boolean;
  loginSocietyAdmin: (params: { adminId?: string; societyId?: string; staffCode?: string; pin?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutSocietyAdmin: () => void;
  switchSocietyAdmin: (admin: SocietyAdminProfile) => void;

  // Federation Admin Auth
  federationAdminUser: FederationAdminProfile | null;
  isFederationAdminAuthenticated: boolean;
  loginFederationAdmin: (params: { officerId?: string; clearanceCode?: string; passcode?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutFederationAdmin: () => void;
  switchFederationAdmin: (officer: FederationAdminProfile) => void;

  // Super Admin Auth
  superAdminUser: SuperAdminProfile | null;
  isSuperAdminAuthenticated: boolean;
  loginSuperAdmin: (params: { officialId?: string; passcode?: string; totpCode?: string; clearanceLevel?: string }) => Promise<{ success: boolean; message?: string }>;
  registerSuperAdmin: (data: { name: string; phone: string; email: string; emailVerified?: boolean; ministry: string; department: string; officialDesignation: string; cadre?: string; employeeCode?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutSuperAdmin: () => void;
  switchSuperAdmin: (admin: SuperAdminProfile) => void;

  // Modal Control
  activeAuthModal: UserRole | null;
  openAuthModal: (role: UserRole) => void;
  closeAuthModal: () => void;

  // Global Auth State
  isAccountLoggedIn: boolean;
  logoutAll: () => void;

  // Available Seed Accounts Directory for easy benchmark & switching
  availableAccounts: {
    customers: CustomerProfile[];
    workers: WorkerProfile[];
    societyAdmins: SocietyAdminProfile[];
    federationAdmins: FederationAdminProfile[];
    superAdminUser?: SuperAdminProfile | null;
    superAdmins: SuperAdminProfile[];
  };
  refreshAccounts: () => Promise<void>;

  // Optional Email Verification for all entities
  sendEmailVerificationOtp: (email: string, role?: UserRole, id?: string, name?: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyEmailOtp: (email: string, otp: string, role?: UserRole, id?: string) => Promise<{ success: boolean; message: string; entity?: any }>;
  unlinkEmail: (role: UserRole, id: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Customer State
  const [customerUser, setCustomerUser] = useState<CustomerProfile | null>(() => {
    const saved = localStorage.getItem('bk_auth_customer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEEDED_CUSTOMERS[0];
  });
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bk_auth_customer_logged_in') === 'true';
  });

  // 2. Worker State
  const [workerUser, setWorkerUser] = useState<WorkerProfile | null>(() => {
    const saved = localStorage.getItem('bk_auth_worker');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return PRIMARY_DEMO_WORKER;
  });
  const [isWorkerAuthenticated, setIsWorkerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bk_auth_worker_logged_in') === 'true';
  });

  // 3. Society Admin State
  const [societyAdminUser, setSocietyAdminUser] = useState<SocietyAdminProfile | null>(() => {
    const saved = localStorage.getItem('bk_auth_society_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEEDED_SOCIETY_ADMINS[0];
  });
  const [isSocietyAdminAuthenticated, setIsSocietyAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bk_auth_society_admin_logged_in') === 'true';
  });

  // 4. Federation Admin State
  const [federationAdminUser, setFederationAdminUser] = useState<FederationAdminProfile | null>(() => {
    const saved = localStorage.getItem('bk_auth_federation_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEEDED_FEDERATION_ADMINS[0];
  });
  const [isFederationAdminAuthenticated, setIsFederationAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bk_auth_federation_admin_logged_in') === 'true';
  });

  // 5. Super Admin State
  const [superAdminUser, setSuperAdminUser] = useState<SuperAdminProfile | null>(() => {
    const saved = localStorage.getItem('bk_auth_super_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEEDED_SUPER_ADMINS[0];
  });
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bk_auth_super_admin_logged_in') === 'true';
  });

  // Modal Control
  const [activeAuthModal, setActiveAuthModal] = useState<UserRole | null>(null);

  // Accounts Directory
  const [availableAccounts, setAvailableAccounts] = useState({
    customers: SEEDED_CUSTOMERS,
    workers: SEEDED_WORKERS,
    societyAdmins: SEEDED_SOCIETY_ADMINS,
    federationAdmins: SEEDED_FEDERATION_ADMINS,
    superAdmins: SEEDED_SUPER_ADMINS,
  });

  const refreshAccounts = async () => {
    try {
      const res = await fetch('/api/auth/accounts');
      if (res.ok) {
        const data = await res.json();
        setAvailableAccounts(data);
      }
    } catch (e) {
      // Keep seeded fallback
    }
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  const dispatchNavigateHome = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('NAVIGATE_HOME'));
      window.dispatchEvent(new CustomEvent('ACCOUNT_LOGGED_OUT'));
    }
  };

  const logoutAll = () => {
    setIsCustomerAuthenticated(false);
    setIsWorkerAuthenticated(false);
    setIsSocietyAdminAuthenticated(false);
    setIsFederationAdminAuthenticated(false);
    setIsSuperAdminAuthenticated(false);
    localStorage.setItem('bk_auth_customer_logged_in', 'false');
    localStorage.setItem('bk_auth_worker_logged_in', 'false');
    localStorage.setItem('bk_auth_society_admin_logged_in', 'false');
    localStorage.setItem('bk_auth_federation_admin_logged_in', 'false');
    localStorage.setItem('bk_auth_super_admin_logged_in', 'false');
    localStorage.removeItem('bharat_kaushal_is_society_admin_auth');
    localStorage.removeItem('bharat_kaushal_is_federation_admin_auth');
    localStorage.removeItem('bharat_kaushal_is_super_admin_auth');
    localStorage.removeItem('bharat_kaushal_active_role');
    dispatchNavigateHome();
  };

  // ----------------------------------------------------
  // 1. CUSTOMER AUTH FUNCTIONS
  // ----------------------------------------------------
  const loginCustomer = async (params: { phone?: string; customerId?: string; email?: string; otp?: string }) => {
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomerUser(data.customer);
        setIsCustomerAuthenticated(true);
        localStorage.setItem('bk_auth_customer', JSON.stringify(data.customer));
        localStorage.setItem('bk_auth_customer_logged_in', 'true');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Customer authentication failed' };
    } catch (err: any) {
      // Local fallback for offline/demo
      const found = availableAccounts.customers.find(
        (c) => (params.customerId && c.id === params.customerId) || (params.phone && c.phone === params.phone)
      ) || availableAccounts.customers[0];
      setCustomerUser(found);
      setIsCustomerAuthenticated(true);
      localStorage.setItem('bk_auth_customer', JSON.stringify(found));
      localStorage.setItem('bk_auth_customer_logged_in', 'true');
      return { success: true, message: `Signed in as ${found.name}` };
    }
  };

  const registerCustomer = async (formData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    locality?: string;
    landmark?: string;
    pinCode?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomerUser(data.customer);
        setIsCustomerAuthenticated(true);
        localStorage.setItem('bk_auth_customer', JSON.stringify(data.customer));
        localStorage.setItem('bk_auth_customer_logged_in', 'true');
        await refreshAccounts();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error' };
    }
  };

  const logoutCustomer = () => {
    logoutAll();
  };

  const switchCustomer = (customer: CustomerProfile) => {
    setCustomerUser(customer);
    setIsCustomerAuthenticated(true);
    localStorage.setItem('bk_auth_customer', JSON.stringify(customer));
    localStorage.setItem('bk_auth_customer_logged_in', 'true');
  };

  // ----------------------------------------------------
  // 2. WORKER AUTH FUNCTIONS
  // ----------------------------------------------------
  const loginWorker = async (params: { workerId?: string; phone?: string; uan?: string; pin?: string }) => {
    try {
      const res = await fetch('/api/auth/worker/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWorkerUser(data.worker);
        setIsWorkerAuthenticated(true);
        localStorage.setItem('bk_auth_worker', JSON.stringify(data.worker));
        localStorage.setItem('bk_auth_worker_logged_in', 'true');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Worker login failed' };
    } catch (e: any) {
      const found = availableAccounts.workers.find(
        (w) => (params.workerId && w.id === params.workerId) || (params.phone && w.phone === params.phone)
      ) || availableAccounts.workers[0];
      setWorkerUser(found);
      setIsWorkerAuthenticated(true);
      localStorage.setItem('bk_auth_worker', JSON.stringify(found));
      localStorage.setItem('bk_auth_worker_logged_in', 'true');
      return { success: true, message: `Worker authenticated: ${found.name}` };
    }
  };

  const registerWorker = async (data: Partial<WorkerProfile> & { experienceYears?: number; aadhaar?: string; upiId?: string }) => {
    try {
      const res = await fetch('/api/auth/worker/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setWorkerUser(resData.worker);
        setIsWorkerAuthenticated(true);
        localStorage.setItem('bk_auth_worker', JSON.stringify(resData.worker));
        localStorage.setItem('bk_auth_worker_logged_in', 'true');
        refreshAccounts();
        return { success: true, message: resData.message, worker: resData.worker };
      }
      return { success: false, message: resData.error || 'Worker registration failed' };
    } catch (err: any) {
      // Fallback local registration
      const newWorkerId = `BH-KAUSHAL-WKR-000${124 + availableAccounts.workers.length}`;
      const cleanAadhaar = data.aadhaar ? data.aadhaar.replace(/\D/g, '') : '';
      const fallbackWorker: WorkerProfile = {
        id: newWorkerId,
        name: data.name || 'New Skilled Craftsman',
        phone: data.phone || '9826000000',
        gender: data.gender || 'Male',
        dob: data.dob || '1995-01-01',
        address: data.address || 'Indore, Madhya Pradesh',
        city: data.city || 'Indore',
        district: data.district || 'Indore',
        state: 'Madhya Pradesh',
        pinCode: data.pinCode || '452001',
        societyId: data.societyId || 'SOC-IND-02',
        societyName: data.societyName || 'Indore Shramik Kaushal Sahakari Samiti',
        skills: [{ name: data.primaryTrade || 'Plumbing', isPrimary: true, yearsExperience: data.experienceYears || 3 }],
        primaryTrade: data.primaryTrade || 'Plumbing',
        skillAssessmentScore: data.skillAssessmentScore || 88,
        skillLevel: (data.skillAssessmentScore || 88) >= 90 ? 'Expert' : 'Advanced',
        verificationStatus: 'VERIFIED',
        availability: true,
        rating: 4.9,
        totalRatingsCount: 1,
        completedJobs: 0,
        failedJobs: 0,
        consecutiveFailures: 0,
        penaltyStatus: 'NONE',
        earnings: { today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
        trustScore: 86,
        trustBreakdown: {
          identityScore: 20,
          societyScore: 15,
          skillScore: 18,
          experienceScore: 8,
          performanceScore: 5,
          ratingScore: 10,
          reliabilityScore: 10,
          total: 86,
          notes: ['Aadhaar e-KYC verified', 'Trade skill assessment certified'],
        },
        reliabilityScore: 96,
        currentLocation: { lat: 22.7196, lng: 75.8577, address: 'Indore City' },
        maskedAadhaar: cleanAadhaar.length >= 4 ? `XXXX XXXX ${cleanAadhaar.slice(-4)}` : 'XXXX XXXX 8912',
        maskedPan: data.maskedPan || 'XXXXX4321B',
        documents: { aadhaarUploaded: true, panUploaded: true, licenseUploaded: true, certUploaded: true },
        paymentSetup: { upiId: `${(data.name || 'worker').toLowerCase().replace(/\s+/g, '')}@upi`, bankAccount: 'XXXXXXXX9876', ifsc: 'SBIN0001245', method: 'UPI' },
        welfareBalance: 1500,
        createdAt: new Date().toISOString(),
      };

      setAvailableAccounts((prev) => ({
        ...prev,
        workers: [fallbackWorker, ...prev.workers],
      }));
      setWorkerUser(fallbackWorker);
      setIsWorkerAuthenticated(true);
      localStorage.setItem('bk_auth_worker', JSON.stringify(fallbackWorker));
      localStorage.setItem('bk_auth_worker_logged_in', 'true');
      return { success: true, message: `Worker ${fallbackWorker.name} enrolled into society.`, worker: fallbackWorker };
    }
  };

  const logoutWorker = () => {
    logoutAll();
  };

  const switchWorker = (worker: WorkerProfile) => {
    setWorkerUser(worker);
    setIsWorkerAuthenticated(true);
    localStorage.setItem('bk_auth_worker', JSON.stringify(worker));
    localStorage.setItem('bk_auth_worker_logged_in', 'true');
  };

  // ----------------------------------------------------
  // 3. SOCIETY ADMIN AUTH FUNCTIONS
  // ----------------------------------------------------
  const loginSocietyAdmin = async (params: { adminId?: string; societyId?: string; staffCode?: string; pin?: string }) => {
    try {
      const res = await fetch('/api/auth/society/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSocietyAdminUser(data.societyAdmin);
        setIsSocietyAdminAuthenticated(true);
        localStorage.setItem('bk_auth_society_admin', JSON.stringify(data.societyAdmin));
        localStorage.setItem('bk_auth_society_admin_logged_in', 'true');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Society authorization failed' };
    } catch (e: any) {
      const found = availableAccounts.societyAdmins.find(
        (a) => (params.adminId && a.id === params.adminId) || (params.societyId && a.societyId === params.societyId)
      ) || availableAccounts.societyAdmins[0];
      setSocietyAdminUser(found);
      setIsSocietyAdminAuthenticated(true);
      localStorage.setItem('bk_auth_society_admin', JSON.stringify(found));
      localStorage.setItem('bk_auth_society_admin_logged_in', 'true');
      return { success: true, message: `Society Admin authenticated: ${found.name}` };
    }
  };

  const logoutSocietyAdmin = () => {
    logoutAll();
  };

  const switchSocietyAdmin = (admin: SocietyAdminProfile) => {
    setSocietyAdminUser(admin);
    setIsSocietyAdminAuthenticated(true);
    localStorage.setItem('bk_auth_society_admin', JSON.stringify(admin));
    localStorage.setItem('bk_auth_society_admin_logged_in', 'true');
  };

  // ----------------------------------------------------
  // 4. FEDERATION ADMIN AUTH FUNCTIONS
  // ----------------------------------------------------
  const loginFederationAdmin = async (params: { officerId?: string; clearanceCode?: string; passcode?: string }) => {
    try {
      const res = await fetch('/api/auth/federation/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFederationAdminUser(data.federationAdmin);
        setIsFederationAdminAuthenticated(true);
        localStorage.setItem('bk_auth_federation_admin', JSON.stringify(data.federationAdmin));
        localStorage.setItem('bk_auth_federation_admin_logged_in', 'true');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Clearance authorization failed' };
    } catch (e: any) {
      const found = availableAccounts.federationAdmins.find(
        (f) => params.officerId && f.id === params.officerId
      ) || availableAccounts.federationAdmins[0];
      setFederationAdminUser(found);
      setIsFederationAdminAuthenticated(true);
      localStorage.setItem('bk_auth_federation_admin', JSON.stringify(found));
      localStorage.setItem('bk_auth_federation_admin_logged_in', 'true');
      return { success: true, message: `Federation Clearance granted: ${found.name}` };
    }
  };

  const logoutFederationAdmin = () => {
    logoutAll();
  };

  const switchFederationAdmin = (officer: FederationAdminProfile) => {
    setFederationAdminUser(officer);
    setIsFederationAdminAuthenticated(true);
    localStorage.setItem('bk_auth_federation_admin', JSON.stringify(officer));
    localStorage.setItem('bk_auth_federation_admin_logged_in', 'true');
  };

  // ----------------------------------------------------
  // 5. SUPER ADMIN AUTH FUNCTIONS
  // ----------------------------------------------------
  const loginSuperAdmin = async (params: {
    officialId?: string;
    passcode?: string;
    totpCode?: string;
    clearanceLevel?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuperAdminUser(data.superAdmin);
        setIsSuperAdminAuthenticated(true);
        localStorage.setItem('bk_auth_super_admin', JSON.stringify(data.superAdmin));
        localStorage.setItem('bk_auth_super_admin_logged_in', 'true');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Super Admin authentication failed' };
    } catch (e: any) {
      const found = availableAccounts.superAdmins.find(
        (s) => params.officialId && (s.id.toLowerCase() === params.officialId.toLowerCase() || s.email.toLowerCase() === params.officialId.toLowerCase())
      ) || availableAccounts.superAdmins[0];
      setSuperAdminUser(found);
      setIsSuperAdminAuthenticated(true);
      localStorage.setItem('bk_auth_super_admin', JSON.stringify(found));
      localStorage.setItem('bk_auth_super_admin_logged_in', 'true');
      return { success: true, message: `National Sovereign Clearance granted: ${found.name} (${found.officialDesignation})` };
    }
  };

  const registerSuperAdmin = async (data: {
    name: string;
    phone: string;
    email: string;
    emailVerified?: boolean;
    ministry: string;
    department: string;
    officialDesignation: string;
    cadre?: string;
    employeeCode?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/super-admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setSuperAdminUser(resData.superAdmin);
        setIsSuperAdminAuthenticated(true);
        localStorage.setItem('bk_auth_super_admin', JSON.stringify(resData.superAdmin));
        localStorage.setItem('bk_auth_super_admin_logged_in', 'true');
        setAvailableAccounts((prev) => ({
          ...prev,
          superAdmins: [resData.superAdmin, ...prev.superAdmins],
        }));
        return { success: true, message: resData.message || 'Officer registered successfully' };
      }
      return { success: false, message: resData.error || 'Registration failed' };
    } catch (e: any) {
      const newAdmin: SuperAdminProfile = {
        id: `GOV-${data.ministry.includes('Labour') ? 'MOL' : data.ministry.includes('Cooperation') ? 'CRCS' : 'MSDE'}-${Math.floor(100 + Math.random() * 900)}`,
        name: data.name,
        phone: data.phone,
        email: data.email,
        emailVerified: !!data.emailVerified,
        emailVerifiedAt: data.emailVerified ? new Date().toISOString() : undefined,
        ministry: data.ministry,
        department: data.department,
        officialDesignation: data.officialDesignation,
        cadre: data.cadre || 'Central Secretariat Service',
        clearanceLevel: 'APEX_LEVEL_5_NATIONAL',
        role: 'SUPER_ADMIN',
        mfaMethod: 'AADHAAR_TOTP',
        tokenExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      setSuperAdminUser(newAdmin);
      setIsSuperAdminAuthenticated(true);
      localStorage.setItem('bk_auth_super_admin', JSON.stringify(newAdmin));
      localStorage.setItem('bk_auth_super_admin_logged_in', 'true');
      setAvailableAccounts((prev) => ({
        ...prev,
        superAdmins: [newAdmin, ...prev.superAdmins],
      }));
      return { success: true, message: `Government Clearance Issued for ${data.name}` };
    }
  };

  const logoutSuperAdmin = () => {
    logoutAll();
  };

  const switchSuperAdmin = (admin: SuperAdminProfile) => {
    setSuperAdminUser(admin);
    setIsSuperAdminAuthenticated(true);
    localStorage.setItem('bk_auth_super_admin', JSON.stringify(admin));
    localStorage.setItem('bk_auth_super_admin_logged_in', 'true');
  };

  // ----------------------------------------------------
  // Optional Email Verification Implementation (All Entities)
  // ----------------------------------------------------
  const sendEmailVerificationOtp = async (email: string, role?: UserRole, id?: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, id, name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          message: data.message || `Verification code sent to ${email}`,
          otp: data.otp || '742918',
        };
      }
      return { success: false, message: data.error || 'Failed to dispatch verification code' };
    } catch (e: any) {
      // Offline fallback mock OTP
      const mockOtp = '742918';
      return {
        success: true,
        message: `Verification code dispatched to ${email}`,
        otp: mockOtp,
      };
    }
  };

  const verifyEmailOtp = async (email: string, otp: string, role?: UserRole, id?: string) => {
    const verifiedTimestamp = new Date().toISOString();
    try {
      const res = await fetch('/api/auth/email/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, role, id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update currently active logged in user state in context & localStorage
        if (role === 'CUSTOMER' || customerUser?.id === id) {
          const updated = {
            ...(customerUser || ({} as CustomerProfile)),
            email,
            emailVerified: true,
            emailVerifiedAt: verifiedTimestamp,
          } as CustomerProfile;
          setCustomerUser(updated);
          localStorage.setItem('bk_auth_customer', JSON.stringify(updated));
        } else if (role === 'WORKER' || workerUser?.id === id) {
          const updated = {
            ...(workerUser || ({} as WorkerProfile)),
            email,
            emailVerified: true,
            emailVerifiedAt: verifiedTimestamp,
          } as WorkerProfile;
          setWorkerUser(updated);
          localStorage.setItem('bk_auth_worker', JSON.stringify(updated));
        } else if (role === 'SOCIETY_ADMIN' || societyAdminUser?.id === id) {
          const updated = {
            ...(societyAdminUser || ({} as SocietyAdminProfile)),
            email,
            emailVerified: true,
            emailVerifiedAt: verifiedTimestamp,
          } as SocietyAdminProfile;
          setSocietyAdminUser(updated);
          localStorage.setItem('bk_auth_society_admin', JSON.stringify(updated));
        } else if (role === 'FEDERATION_ADMIN' || federationAdminUser?.id === id) {
          const updated = {
            ...(federationAdminUser || ({} as FederationAdminProfile)),
            email,
            emailVerified: true,
            emailVerifiedAt: verifiedTimestamp,
          } as FederationAdminProfile;
          setFederationAdminUser(updated);
          localStorage.setItem('bk_auth_federation_admin', JSON.stringify(updated));
        } else if (role === 'SUPER_ADMIN' || superAdminUser?.id === id) {
          const updated = {
            ...(superAdminUser || ({} as SuperAdminProfile)),
            email,
            emailVerified: true,
            emailVerifiedAt: verifiedTimestamp,
          } as SuperAdminProfile;
          setSuperAdminUser(updated);
          localStorage.setItem('bk_auth_super_admin', JSON.stringify(updated));
        }

        // Refresh available accounts list to keep directories synchronized
        refreshAccounts();

        return {
          success: true,
          message: data.message || 'Email verified successfully!',
          entity: data.entity,
        };
      }
      return { success: false, message: data.error || 'Invalid verification code' };
    } catch (e: any) {
      // Local fallback
      if (role === 'CUSTOMER') {
        const updated = { ...(customerUser || {}), email, emailVerified: true, emailVerifiedAt: verifiedTimestamp } as CustomerProfile;
        setCustomerUser(updated);
        localStorage.setItem('bk_auth_customer', JSON.stringify(updated));
      } else if (role === 'WORKER') {
        const updated = { ...(workerUser || {}), email, emailVerified: true, emailVerifiedAt: verifiedTimestamp } as WorkerProfile;
        setWorkerUser(updated);
        localStorage.setItem('bk_auth_worker', JSON.stringify(updated));
      } else if (role === 'SOCIETY_ADMIN') {
        const updated = { ...(societyAdminUser || {}), email, emailVerified: true, emailVerifiedAt: verifiedTimestamp } as SocietyAdminProfile;
        setSocietyAdminUser(updated);
        localStorage.setItem('bk_auth_society_admin', JSON.stringify(updated));
      } else if (role === 'FEDERATION_ADMIN') {
        const updated = { ...(federationAdminUser || {}), email, emailVerified: true, emailVerifiedAt: verifiedTimestamp } as FederationAdminProfile;
        setFederationAdminUser(updated);
        localStorage.setItem('bk_auth_federation_admin', JSON.stringify(updated));
      } else if (role === 'SUPER_ADMIN') {
        const updated = { ...(superAdminUser || {}), email, emailVerified: true, emailVerifiedAt: verifiedTimestamp } as SuperAdminProfile;
        setSuperAdminUser(updated);
        localStorage.setItem('bk_auth_super_admin', JSON.stringify(updated));
      }
      return { success: true, message: 'Email address verified successfully!' };
    }
  };

  const unlinkEmail = async (role: UserRole, id: string) => {
    try {
      await fetch('/api/auth/email/unlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, id }),
      });
    } catch (e) {
      /* ignore */
    }

    if (role === 'CUSTOMER') {
      const updated = { ...(customerUser || {}), emailVerified: false, emailVerifiedAt: undefined } as CustomerProfile;
      setCustomerUser(updated);
      localStorage.setItem('bk_auth_customer', JSON.stringify(updated));
    } else if (role === 'WORKER') {
      const updated = { ...(workerUser || {}), emailVerified: false, emailVerifiedAt: undefined } as WorkerProfile;
      setWorkerUser(updated);
      localStorage.setItem('bk_auth_worker', JSON.stringify(updated));
    } else if (role === 'SOCIETY_ADMIN') {
      const updated = { ...(societyAdminUser || {}), emailVerified: false, emailVerifiedAt: undefined } as SocietyAdminProfile;
      setSocietyAdminUser(updated);
      localStorage.setItem('bk_auth_society_admin', JSON.stringify(updated));
    } else if (role === 'FEDERATION_ADMIN') {
      const updated = { ...(federationAdminUser || {}), emailVerified: false, emailVerifiedAt: undefined } as FederationAdminProfile;
      setFederationAdminUser(updated);
      localStorage.setItem('bk_auth_federation_admin', JSON.stringify(updated));
    } else if (role === 'SUPER_ADMIN') {
      const updated = { ...(superAdminUser || {}), emailVerified: false, emailVerifiedAt: undefined } as SuperAdminProfile;
      setSuperAdminUser(updated);
      localStorage.setItem('bk_auth_super_admin', JSON.stringify(updated));
    }

    refreshAccounts();
    return { success: true, message: 'Email unlinked.' };
  };

  // ----------------------------------------------------
  // Modal Handlers
  // ----------------------------------------------------
  const openAuthModal = (role: UserRole) => {
    setActiveAuthModal(role);
  };

  const closeAuthModal = () => {
    setActiveAuthModal(null);
  };


  const isAccountLoggedIn = Boolean(
    isCustomerAuthenticated ||
    isWorkerAuthenticated ||
    isSocietyAdminAuthenticated ||
    isFederationAdminAuthenticated ||
    isSuperAdminAuthenticated
  );

  return (
    <AuthContext.Provider
      value={{
        isAccountLoggedIn,
        logoutAll,

        customerUser,
        isCustomerAuthenticated,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        switchCustomer,

        workerUser,
        isWorkerAuthenticated,
        loginWorker,
        registerWorker,
        logoutWorker,
        switchWorker,

        societyAdminUser,
        isSocietyAdminAuthenticated,
        loginSocietyAdmin,
        logoutSocietyAdmin,
        switchSocietyAdmin,

        federationAdminUser,
        isFederationAdminAuthenticated,
        loginFederationAdmin,
        logoutFederationAdmin,
        switchFederationAdmin,

        superAdminUser,
        isSuperAdminAuthenticated,
        loginSuperAdmin,
        registerSuperAdmin,
        logoutSuperAdmin,
        switchSuperAdmin,

        activeAuthModal,
        openAuthModal,
        closeAuthModal,

        availableAccounts,
        refreshAccounts,

        sendEmailVerificationOtp,
        verifyEmailOtp,
        unlinkEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
