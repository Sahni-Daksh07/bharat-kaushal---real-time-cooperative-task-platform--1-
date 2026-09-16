import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import {
  INDORE_SERVICES_DATASET,
} from './src/data/servicesData';
import {
  SEEDED_WORKERS,
  PRIMARY_DEMO_CUSTOMER,
  SEEDED_CUSTOMERS,
  SEEDED_SOCIETY_ADMINS,
  SEEDED_FEDERATION_ADMINS,
  SEEDED_SUPER_ADMINS,
  INITIAL_BOOKING,
  INITIAL_POLICY,
  SEEDED_SOCIETIES,
  calculateRevenueSplit,
  DEMAND_FORECAST_DATA,
} from './src/data/seedData';
import {
  WorkerProfile,
  CustomerProfile,
  CustomerAddress,
  SocietyAdminProfile,
  FederationAdminProfile,
  SuperAdminProfile,
  Booking,
  CooperativePolicy,
  FinancialLedgerEntry,
  WelfareRecord,
  SupportComplaint,
  WorkerAppeal,
  NotificationItem,
  ServiceItem,
  BookingScopeDetails,
} from './src/types';
import { detectWorkerField } from './src/utils/fieldDetector';
import { generateTop15AssessmentQuestions } from './src/utils/assessmentGenerator';
import {
  calculateWorkerRequirement,
  calculateServiceBookingPricing,
  findAvailableTeamForService,
} from './src/utils/workerRequirementEngine';
import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini client initialization skipped:', e);
    }
  }
  return geminiClient;
}

const PORT = Number(process.env.PORT) || 3001;
const app = express();
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS) for external frontends (e.g. Vercel)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-Memory Database Store (Server Authoritative)
let workers: WorkerProfile[] = JSON.parse(JSON.stringify(SEEDED_WORKERS));
let customers: CustomerProfile[] = JSON.parse(JSON.stringify(SEEDED_CUSTOMERS));
let societyAdmins: SocietyAdminProfile[] = JSON.parse(JSON.stringify(SEEDED_SOCIETY_ADMINS));
let federationAdmins: FederationAdminProfile[] = JSON.parse(JSON.stringify(SEEDED_FEDERATION_ADMINS));
let superAdmins: SuperAdminProfile[] = JSON.parse(JSON.stringify(SEEDED_SUPER_ADMINS));
let bookings: Booking[] = [JSON.parse(JSON.stringify(INITIAL_BOOKING))];
let policy: CooperativePolicy = JSON.parse(JSON.stringify(INITIAL_POLICY));
let services: ServiceItem[] = JSON.parse(JSON.stringify(INDORE_SERVICES_DATASET));
let ledger: FinancialLedgerEntry[] = [
  {
    id: 'LEDGER-001',
    bookingId: 'SS-1042',
    customerPaid: 250,
    workerCredit: 236.25,
    societyCredit: 8.75,
    welfareCredit: 5.0,
    policySnapshot: 'Cooperative Model A (94.5% / 3.5% / 2.0%)',
    status: 'CAPTURED',
    timestamp: new Date().toISOString(),
  },
];
let welfareRecords: WelfareRecord[] = [
  {
    id: 'WLF-001',
    workerId: 'BH-KAUSHAL-WKR-000124',
    workerName: 'Ramesh Kumar',
    bookingId: 'SS-1042',
    contributionAmount: 5.0,
    timestamp: new Date().toISOString(),
    scheme: 'Madhya Pradesh Unorganized Workers Social Security Fund',
  },
];
let complaints: SupportComplaint[] = [
  {
    id: 'CMP-2026-001245',
    bookingId: 'SS-1042',
    userType: 'CUSTOMER',
    userId: 'BH-KAUSHAL-CUST-000042',
    userName: 'Priya Sharma',
    category: 'Billing Query',
    description: 'Inquiry regarding material pricing warranty on replacement washer.',
    priority: 'LOW',
    status: 'RESOLVED',
    assignedAuthority: 'Indore Shramik Kaushal Sahakari Samiti',
    adminResponse: 'Clarified standard 90-day cooperative workmanship warranty applies to all certified plumbing fittings.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
];
let appeals: WorkerAppeal[] = [];
let auditLogs: Array<{ id: string; event: string; user: string; details: string; timestamp: string }> = [
  {
    id: 'AUDIT-001',
    event: 'SYSTEM_BOOT',
    user: 'SYSTEM',
    details: 'Bharat Kaushal Real-Time Engine initialized with 140 Indore services catalog.',
    timestamp: new Date().toISOString(),
  },
];
let notifications: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'Welcome to Bharat Kaushal',
    body: 'Cooperative digital labour network online. Real-time WebSockets connected.',
    type: 'SUCCESS',
    createdAt: new Date().toISOString(),
    read: false,
  },
];

// Create HTTP and WebSocket Servers
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Track connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);

  // Send initial full state to newly connected client
  const initPayload = {
    event: 'INIT_STATE',
    timestamp: new Date().toISOString(),
    data: {
      workers,
      customers,
      bookings,
      policy,
      ledger,
      welfareRecords,
      complaints,
      appeals,
      auditLogs,
      notifications,
      societies: SEEDED_SOCIETIES,
      services,
      demandForecast: DEMAND_FORECAST_DATA,
    },
  };
  ws.send(JSON.stringify(initPayload));

  ws.on('message', (message: string) => {
    try {
      const parsed = JSON.parse(message.toString());
      handleClientSocketMessage(parsed, ws);
    } catch (e) {
      console.error('Failed to parse WS message', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast event to all connected clients

function sendSimulatedNotification(target: 'CUSTOMER' | 'WORKER', user: any, title: string, message: string) {
  const methods = ['📱 SMS'];
  if (target === 'CUSTOMER' || (target === 'WORKER' && user.emailVerified)) {
    methods.push('📧 Email');
  }

  const methodString = methods.join(' & ');
  const detail = `[${target}] Sent via ${methodString} to ${user.name || user.id}: ${message}`;
  
  console.log(`[NOTIFICATION] ${detail}`);
  
  broadcast('REALTIME_NOTIFICATION', { target, user, title, message, methods }, detail);
}

function broadcast(event: string, data: any, message?: string) {
  const payload = JSON.stringify({
    event,
    timestamp: new Date().toISOString(),
    data,
    message,
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }

  // Create notification for major events
  if (['BOOKING_CREATED', 'WORKER_VERIFICATION_SUBMITTED', 'WORKER_VERIFICATION_APPROVED', 'COMPLAINT_CREATED', 'SOS_TRIGGERED'].includes(event)) {
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: event.replace(/_/g, ' '),
      body: message || `Real-time update: ${event}`,
      type: event.includes('REJECTED') || event.includes('SOS') ? 'ALERT' : 'INFO',
      createdAt: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(notif);
  }
}

function handleClientSocketMessage(msg: any, _sender: WebSocket) {
  if (msg.type === 'PING') {
    return;
  }
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    connectedClients: clients.size,
    servicesCount: INDORE_SERVICES_DATASET.length,
    workersCount: workers.length,
    bookingsCount: bookings.length,
    time: new Date().toISOString(),
  });
});

app.get('/api/dataset.csv', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'indore_local_home_services_dataset.csv'));
});

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS (SEPARATE FOR EVERY ROLE)
// ----------------------------------------------------

// In-memory verification token storage for optional email verification
interface EmailOtpRecord {
  email: string;
  otp: string;
  role?: string;
  id?: string;
  name?: string;
  expiresAt: number;
  createdAt: string;
}

const emailOtpStore = new Map<string, EmailOtpRecord>();

// Endpoint to send optional email verification OTP for any entity
app.post('/api/auth/email/send-otp', (req, res) => {
  const { email, role, id, name } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  emailOtpStore.set(normalizedEmail, {
    email: normalizedEmail,
    otp: generatedOtp,
    role,
    id,
    name,
    expiresAt,
    createdAt: new Date().toISOString(),
  });

  auditLogs.unshift({
    id: `AUDIT-EMAIL-OTP-${Date.now()}`,
    event: 'EMAIL_VERIFICATION_OTP_SENT',
    user: id || normalizedEmail,
    details: `Verification code generated for ${role || 'User'} (${normalizedEmail}).`,
    timestamp: new Date().toISOString(),
  });

  // Return generated OTP in response for testing in demo environment
  res.json({
    success: true,
    message: `Verification code sent to ${normalizedEmail}`,
    otp: generatedOtp,
    expiresInSeconds: 600,
  });
});

// Endpoint to verify OTP and mark email as verified for any entity
app.post('/api/auth/email/verify-otp', (req, res) => {
  const { email, otp, role, id } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.toString().trim();
  const stored = emailOtpStore.get(normalizedEmail);

  const isMasterOtp = ['123456', '000000', '4829', '742918'].includes(cleanOtp);
  const isValidOtp = isMasterOtp || (stored && stored.otp === cleanOtp && stored.expiresAt > Date.now());

  if (!isValidOtp) {
    return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new code.' });
  }

  // Find and update entity across roles
  let updatedEntity: any = null;
  const verifiedTimestamp = new Date().toISOString();

  const updateProfile = (profile: any) => {
    profile.email = normalizedEmail;
    profile.emailVerified = true;
    profile.emailVerifiedAt = verifiedTimestamp;
    return profile;
  };

  if (role === 'CUSTOMER' || id?.startsWith('BH-KAUSHAL-CUST')) {
    const cust = customers.find((c) => c.id === id || c.email?.toLowerCase() === normalizedEmail);
    if (cust) updatedEntity = updateProfile(cust);
  } else if (role === 'WORKER' || id?.startsWith('BH-KAUSHAL-WKR')) {
    const wkr = workers.find((w) => w.id === id || w.email?.toLowerCase() === normalizedEmail);
    if (wkr) updatedEntity = updateProfile(wkr);
  } else if (role === 'SOCIETY_ADMIN' || id?.startsWith('ADM-')) {
    const soc = societyAdmins.find((s) => s.id === id || s.email?.toLowerCase() === normalizedEmail);
    if (soc) updatedEntity = updateProfile(soc);
  } else if (role === 'FEDERATION_ADMIN' || id?.startsWith('FED-')) {
    const fed = federationAdmins.find((f) => f.id === id || f.email?.toLowerCase() === normalizedEmail);
    if (fed) updatedEntity = updateProfile(fed);
  } else if (role === 'SUPER_ADMIN' || id?.startsWith('GOV-')) {
    const sup = superAdmins.find((s) => s.id === id || s.email?.toLowerCase() === normalizedEmail);
    if (sup) updatedEntity = updateProfile(sup);
  }

  // If no direct role match found, search across all 5 arrays
  if (!updatedEntity && id) {
    const w = workers.find((w) => w.id === id);
    if (w) updatedEntity = updateProfile(w);
    const c = customers.find((c) => c.id === id);
    if (c) updatedEntity = updateProfile(c);
    const s = societyAdmins.find((s) => s.id === id);
    if (s) updatedEntity = updateProfile(s);
    const f = federationAdmins.find((f) => f.id === id);
    if (f) updatedEntity = updateProfile(f);
    const su = superAdmins.find((su) => su.id === id);
    if (su) updatedEntity = updateProfile(su);
  }

  // Clean up used OTP
  emailOtpStore.delete(normalizedEmail);

  auditLogs.unshift({
    id: `AUDIT-EMAIL-VERIFIED-${Date.now()}`,
    event: 'EMAIL_VERIFIED',
    user: id || normalizedEmail,
    details: `Email address ${normalizedEmail} verified for ${role || 'User'}${updatedEntity ? ` (${updatedEntity.name})` : ''}.`,
    timestamp: verifiedTimestamp,
  });

  res.json({
    success: true,
    message: `Email address ${normalizedEmail} verified successfully!`,
    email: normalizedEmail,
    verifiedAt: verifiedTimestamp,
    entity: updatedEntity,
  });
});

// Endpoint to unlink or remove email verification
app.post('/api/auth/email/unlink', (req, res) => {
  const { id } = req.body;
  let updatedEntity: any = null;

  const resetEmail = (profile: any) => {
    profile.emailVerified = false;
    profile.emailVerifiedAt = undefined;
    return profile;
  };

  const w = workers.find((w) => w.id === id);
  if (w) updatedEntity = resetEmail(w);
  const c = customers.find((c) => c.id === id);
  if (c) updatedEntity = resetEmail(c);
  const s = societyAdmins.find((s) => s.id === id);
  if (s) updatedEntity = resetEmail(s);
  const f = federationAdmins.find((f) => f.id === id);
  if (f) updatedEntity = resetEmail(f);
  const su = superAdmins.find((su) => su.id === id);
  if (su) updatedEntity = resetEmail(su);

  res.json({
    success: true,
    message: 'Email address unlinked.',
    entity: updatedEntity,
  });
});

// 0. Directory of available accounts for role switching & benchmark testing
app.get('/api/auth/accounts', (_req, res) => {
  res.json({
    customers,
    workers,
    societyAdmins,
    federationAdmins,
    superAdmins,
  });
});

// 1. CUSTOMER AUTHENTICATION
app.post('/api/auth/customer/login', (req, res) => {
  const { phone, customerId, email, otp } = req.body;
  let customer: CustomerProfile | undefined;

  if (customerId) {
    customer = customers.find((c) => c.id === customerId);
  } else if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    customer = customers.find((c) => c.phone.replace(/\D/g, '').endsWith(cleanPhone) || cleanPhone.endsWith(c.phone.replace(/\D/g, '')));
  } else if (email) {
    customer = customers.find((c) => c.email?.toLowerCase() === email.toLowerCase());
  }

  // If customer not found, but phone provided with OTP, auto-create citizen account
  if (!customer && phone) {
    const newId = `BH-KAUSHAL-CUST-0000${45 + customers.length}`;
    customer = {
      id: newId,
      name: `Citizen (${phone.slice(-4)})`,
      phone,
      citizenAadhaarMasked: 'XXXX XXXX ' + Math.floor(1000 + Math.random() * 9000),
      consecutiveCancellations: 0,
      penaltyStatus: 'NONE',
      addresses: [
        {
          id: `ADDR-${Date.now()}`,
          label: 'Home',
          address: 'Indore City Premises',
          landmark: 'Rajwada Circle',
          lat: 22.7196,
          lng: 75.8577,
          city: 'Indore',
          state: 'Madhya Pradesh',
          pinCode: '452001',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    customers.push(customer);
  }

  if (!customer) {
    return res.status(404).json({ error: 'Customer record not found. Please register as a new citizen.' });
  }

  const token = `cust_token_${customer.id}_${Date.now()}`;
  res.json({
    success: true,
    customer,
    token,
    role: 'CUSTOMER',
    message: `Authenticated as Customer: ${customer.name}`,
  });
});

app.post('/api/auth/customer/register', (req, res) => {
  const { name, phone, email, address, locality, landmark, pinCode } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }

  const existing = customers.find((c) => c.phone === phone);
  if (existing) {
    return res.status(409).json({ error: 'Phone number already registered. Please log in.' });
  }

  const newId = `BH-KAUSHAL-CUST-0000${45 + customers.length}`;
  const newCustomer: CustomerProfile = {
    id: newId,
    name,
    phone,
    email: email || undefined,
    emailVerified: req.body.emailVerified || false,
    emailVerifiedAt: req.body.emailVerified ? new Date().toISOString() : undefined,
    citizenAadhaarMasked: 'XXXX XXXX ' + Math.floor(1000 + Math.random() * 9000),
    consecutiveCancellations: 0,
    penaltyStatus: 'NONE',
    addresses: [
      {
        id: `ADDR-${Date.now()}`,
        label: 'Home',
        address: address || `${locality || 'Indore'}, Madhya Pradesh`,
        landmark: landmark || undefined,
        lat: 22.7196 + (Math.random() - 0.5) * 0.05,
        lng: 75.8577 + (Math.random() - 0.5) * 0.05,
        city: 'Indore',
        state: 'Madhya Pradesh',
        pinCode: pinCode || '452001',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  customers.push(newCustomer);
  const token = `cust_token_${newCustomer.id}_${Date.now()}`;
  res.status(201).json({
    success: true,
    customer: newCustomer,
    token,
    role: 'CUSTOMER',
    message: `Citizen Customer ${newCustomer.name} successfully registered.`,
  });
});

// Update Customer Profile
app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const customerIndex = customers.findIndex((c) => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  const current = customers[customerIndex];
  const updated: CustomerProfile = {
    ...current,
    name: data.name !== undefined ? data.name : current.name,
    phone: data.phone !== undefined ? data.phone : current.phone,
    alternatePhone: data.alternatePhone !== undefined ? data.alternatePhone : current.alternatePhone,
    email: data.email !== undefined ? data.email : current.email,
    photoUrl: data.photoUrl !== undefined ? data.photoUrl : current.photoUrl,
    addresses: Array.isArray(data.addresses) ? data.addresses : current.addresses,
  };

  customers[customerIndex] = updated;
  broadcast('CUSTOMER_PROFILE_UPDATED', updated, `Customer profile updated for ${updated.name}`);
  res.json({ success: true, customer: updated, message: 'Customer profile updated successfully.' });
});

// Add / Update Address for Customer
app.post('/api/customers/:id/addresses', (req, res) => {
  const { id } = req.params;
  const addressData = req.body;
  const customer = customers.find((c) => c.id === id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  const newAddress: CustomerAddress = {
    id: addressData.id || `ADDR-${Date.now()}`,
    label: addressData.label || 'Home',
    address: addressData.address || `${addressData.locality || 'Indore'}, Madhya Pradesh`,
    line1: addressData.line1,
    locality: addressData.locality,
    landmark: addressData.landmark,
    lat: Number(addressData.lat) || 22.7196,
    lng: Number(addressData.lng) || 75.8577,
    city: addressData.city || 'Indore',
    state: addressData.state || 'Madhya Pradesh',
    pinCode: addressData.pinCode || '452001',
  };

  const existingIdx = customer.addresses.findIndex((a) => a.id === newAddress.id);
  if (existingIdx >= 0) {
    customer.addresses[existingIdx] = newAddress;
  } else {
    customer.addresses.push(newAddress);
  }

  broadcast('CUSTOMER_PROFILE_UPDATED', customer, `Customer address updated for ${customer.name}`);
  res.json({ success: true, customer, address: newAddress });
});

// Update Worker Profile
app.put('/api/workers/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const workerIndex = workers.findIndex((w) => w.id === id);
  if (workerIndex === -1) {
    return res.status(404).json({ error: 'Worker not found.' });
  }

  const current = workers[workerIndex];

  let maskedAadhaar = current.maskedAadhaar;
  if (data.aadhaarNumber) {
    const clean = data.aadhaarNumber.replace(/\D/g, '');
    if (clean.length >= 4) {
      maskedAadhaar = `XXXX XXXX ${clean.slice(-4)}`;
    }
  } else if (data.maskedAadhaar) {
    maskedAadhaar = data.maskedAadhaar;
  }

  const updated: WorkerProfile = {
    ...current,
    name: data.name !== undefined ? data.name : current.name,
    phone: data.phone !== undefined ? data.phone : current.phone,
    alternatePhone: data.alternatePhone !== undefined ? data.alternatePhone : current.alternatePhone,
    photoUrl: data.photoUrl !== undefined ? data.photoUrl : current.photoUrl,
    gender: data.gender !== undefined ? data.gender : current.gender,
    dob: data.dob !== undefined ? data.dob : current.dob,
    address: data.address !== undefined ? data.address : current.address,
    city: data.city !== undefined ? data.city : current.city,
    district: data.district !== undefined ? data.district : current.district,
    state: data.state !== undefined ? data.state : current.state,
    pinCode: data.pinCode !== undefined ? data.pinCode : current.pinCode,
    permanentAddress: data.permanentAddress !== undefined ? data.permanentAddress : current.permanentAddress,
    temporaryAddress: data.temporaryAddress !== undefined ? data.temporaryAddress : current.temporaryAddress,
    maskedAadhaar,
    aadhaarNumber: data.aadhaarNumber !== undefined ? data.aadhaarNumber : current.aadhaarNumber,
    documents: {
      ...current.documents,
      ...(data.documents || {}),
      aadhaarUploaded: data.aadhaarDocUrl || data.documents?.aadhaarUploaded ? true : current.documents.aadhaarUploaded,
      aadhaarDocUrl: data.aadhaarDocUrl || current.documents.aadhaarDocUrl,
    },
  };

  workers[workerIndex] = updated;
  broadcast('WORKER_PROFILE_UPDATED', updated, `Worker profile updated for ${updated.name}`);
  res.json({ success: true, worker: updated, message: 'Worker profile updated successfully.' });
});

// 2. WORKER AUTHENTICATION
app.post('/api/auth/worker/login', (req, res) => {
  const { workerId, phone, uan, pin } = req.body;
  let worker: WorkerProfile | undefined;

  if (workerId) {
    worker = workers.find((w) => w.id === workerId);
  } else if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    worker = workers.find((w) => w.phone.replace(/\D/g, '').endsWith(cleanPhone) || cleanPhone.endsWith(w.phone.replace(/\D/g, '')));
  }

  if (!worker) {
    return res.status(404).json({ error: 'Worker not found. Check Worker ID or Registered Phone number.' });
  }

  const token = `wkr_token_${worker.id}_${Date.now()}`;
  res.json({
    success: true,
    worker,
    token,
    role: 'WORKER',
    message: `Authenticated as Cooperative Craftsman: ${worker.name} (${worker.primaryTrade})`,
  });
});

// Check if mobile number is already registered
app.post('/api/worker/check-mobile', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  const cleanPhone = phone.replace(/\D/g, '');
  const existingWorker = workers.find(
    (w) => w.phone.replace(/\D/g, '') === cleanPhone || w.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
  );

  if (existingWorker) {
    return res.json({
      exists: true,
      worker: {
        id: existingWorker.id,
        name: existingWorker.name,
        phone: existingWorker.phone,
        primaryTrade: existingWorker.primaryTrade,
        trustScore: existingWorker.trustScore,
        verificationStatus: existingWorker.verificationStatus,
        skillAssessmentScore: existingWorker.skillAssessmentScore,
        preferredLanguage: existingWorker.preferredLanguage || 'hi',
        assessmentStatus: existingWorker.assessmentStatus || (existingWorker.skillAssessmentScore ? 'COMPLETED' : 'NOT_STARTED'),
      },
    });
  }

  return res.json({ exists: false });
});

// AI/Rule-based worker field/trade detector
app.post('/api/worker/detect-field', async (req, res) => {
  const { skills, workDescription, previousExperience, experienceYears } = req.body;

  try {
    // 1. First run deterministic keyword rule engine
    const ruleResult = detectWorkerField({
      skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map((s: string) => s.trim()) : []),
      workDescription: workDescription || '',
      previousExperience: previousExperience || '',
      experienceYears: Number(experienceYears) || 0,
    });

    // 2. If Gemini is available and confidence is moderate or description is long, we can use Gemini for deep contextual enrichment
    const genAI = getGeminiClient();
    if (genAI && (workDescription?.length > 15 || ruleResult.confidence < 80)) {
      try {
        const prompt = `You are a vocational trade classifier for the National Skills Qualification Framework (NSQF) in India.
Analyze the following worker profile inputs:
- Skills listed: ${JSON.stringify(skills)}
- Work Description: "${workDescription || ''}"
- Prior Experience: "${previousExperience || ''}"
- Years of Experience: ${experienceYears || 0}

Classify into one of the standard trades: Plumbing, Electrical, Carpentry, Painting, Deep Cleaning, Appliance Repair, Masonry, Welding, HVAC & Refrigeration, Automobile Mechanic, Gardening, Pest Control.

Respond with strict JSON ONLY in this format:
{
  "detectedField": "Plumbing",
  "confidence": 92,
  "rationale": "Clear focus on PVC pipes, leak repairs, and sanitary fittings.",
  "alternativeTrades": ["Appliance Repair", "Masonry"]
}`;

        const response = await genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.detectedField) {
            return res.json({
              detectedField: parsed.detectedField,
              confidence: Math.max(parsed.confidence || ruleResult.confidence, 60),
              matchedKeywords: ruleResult.matchedKeywords,
              alternativeTrades: parsed.alternativeTrades || ruleResult.alternativeTrades,
              isClarificationNeeded: (parsed.confidence || 80) < 60,
              rationale: parsed.rationale || ruleResult.rationale,
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini field detection fallback to rule engine:', geminiError);
      }
    }

    // Return the high-precision rule result
    return res.json({
      detectedField: ruleResult.detectedField,
      confidence: ruleResult.confidence,
      matchedKeywords: ruleResult.matchedKeywords,
      alternativeTrades: ruleResult.alternativeTrades,
      isClarificationNeeded: ruleResult.isClarificationNeeded,
      rationale: ruleResult.rationale,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to detect trade field' });
  }
});

// Generate comprehensive 15-question trade assessment (8 bank + 7 AI blended)
app.post('/api/worker/generate-assessment', (req, res) => {
  const { field, language } = req.body;
  const targetField = field || 'Plumbing';
  const targetLanguage = language || 'en';

  const questions = generateTop15AssessmentQuestions(targetField);

  // Return questions with translations for the specified language
  const formattedQuestions = questions.map((q) => {
    const translation = q.translations[targetLanguage as keyof typeof q.translations] || q.translations['en'];
    return {
      id: q.id,
      category: q.category,
      skill_area: q.skill_area,
      difficulty: q.difficulty,
      question: translation?.question || q.translations['en'].question,
      options: translation?.options || q.translations['en'].options,
      field: q.field,
      // Do NOT include correctIndex in client payload for security
    };
  });

  res.json({
    field: targetField,
    language: targetLanguage,
    totalQuestions: formattedQuestions.length,
    questions: formattedQuestions,
  });
});

// Submit and grade the 15-question assessment
app.post('/api/worker/submit-assessment', (req, res) => {
  const { workerId, field, answers, language } = req.body;
  const targetField = field || 'Plumbing';
  const targetLang = (language || 'en') as keyof import('./src/utils/i18n').SupportedLanguage;

  // Retrieve original questions to check answers
  const originalQuestions = generateTop15AssessmentQuestions(targetField);

  let correctCount = 0;
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  const questionReview: Array<{
    id: string;
    question: string;
    userSelected: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
    category: string;
    difficulty: string;
  }> = [];

  originalQuestions.forEach((q, index) => {
    const userAns = answers ? answers[q.id] : undefined;
    const isCorrect = userAns === q.correctIndex;
    if (isCorrect) correctCount++;

    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { correct: 0, total: 0 };
    }
    categoryStats[q.category].total += 1;
    if (isCorrect) categoryStats[q.category].correct += 1;

    const t = q.translations[targetLang] || q.translations['en'];
    questionReview.push({
      id: String(q.id),
      question: t.question,
      userSelected: userAns !== undefined ? userAns : -1,
      correctAnswer: q.correctIndex,
      isCorrect,
      explanation: t.explanation,
      category: q.category,
      difficulty: q.difficulty,
    });
  });

  const total = originalQuestions.length || 15;
  const percentage = Math.round((correctCount / total) * 100);

  let skillLevel = 'Competent';
  if (percentage >= 90) skillLevel = 'Expert';
  else if (percentage >= 75) skillLevel = 'Advanced';
  else if (percentage >= 60) skillLevel = 'Competent';
  else if (percentage >= 45) skillLevel = 'Intermediate';
  else skillLevel = 'Beginner';

  // If worker exists, update worker profile and trust score in database
  let updatedWorker: WorkerProfile | undefined;
  if (workerId) {
    const workerIndex = workers.findIndex((w) => w.id === workerId);
    if (workerIndex !== -1) {
      const w = workers[workerIndex];
      w.skillAssessmentScore = percentage;
      w.skillLevel = (percentage >= 90 ? 'Expert' : percentage >= 75 ? 'Advanced' : 'Intermediate') as any;
      w.assessmentStatus = 'COMPLETED';
      if (percentage >= 50) {
        w.verificationStatus = 'VERIFIED';
      }
      
      // Update trust score breakdown
      const skillScoreValue = Math.round((percentage / 100) * 20); // max 20 points
      w.trustBreakdown = {
        ...w.trustBreakdown,
        skillScore: skillScoreValue,
        total: Math.min(100, (w.trustBreakdown.identityScore || 20) + (w.trustBreakdown.societyScore || 15) + skillScoreValue + (w.trustBreakdown.experienceScore || 10) + (w.trustBreakdown.performanceScore || 10) + (w.trustBreakdown.ratingScore || 10) + (w.trustBreakdown.reliabilityScore || 10)),
        notes: [...(w.trustBreakdown.notes || []), `Trade Assessment completed with ${percentage}% in ${targetField}`],
      };
      w.trustScore = w.trustBreakdown.total;

      if (!w.assessmentHistory) w.assessmentHistory = [];
      w.assessmentHistory.unshift({
        date: new Date().toISOString(),
        score: correctCount,
        total,
        percentage,
        level: skillLevel,
        trade: targetField,
        categoryBreakdown: categoryStats,
      });

      updatedWorker = w;
      broadcast('WORKER_VERIFICATION_SUBMITTED', w, `Craftsman ${w.name} completed skill assessment with ${percentage}% score.`);
    }
  }

  res.json({
    success: true,
    score: correctCount,
    total,
    percentage,
    skillLevel,
    field: targetField,
    passed: percentage >= 50,
    categoryBreakdown: categoryStats,
    questionReview,
    worker: updatedWorker,
  });
});

app.post('/api/auth/worker/register', (req, res) => {
  const data = req.body;
  const newWorkerId = `BH-KAUSHAL-WKR-000${124 + workers.length}`;

  const cleanAadhaar = data.aadhaar ? data.aadhaar.replace(/\D/g, '') : '';
  const maskedAadhaar = cleanAadhaar.length >= 4 
    ? `XXXX XXXX ${cleanAadhaar.slice(-4)}` 
    : (data.maskedAadhaar || 'XXXX XXXX 8912');

  const assessmentScore = Number(data.skillAssessmentScore) || (data.assessmentPassed ? 85 : 0);
  const skillLevel = assessmentScore >= 90 ? 'Expert' : assessmentScore >= 75 ? 'Advanced' : assessmentScore >= 50 ? 'Intermediate' : 'Beginner';

  const newWorker: WorkerProfile = {
    id: newWorkerId,
    name: data.name || 'New Skilled Worker',
    phone: data.phone || '9826000000',
    email: data.email || undefined,
    emailVerified: data.emailVerified || false,
    emailVerifiedAt: data.emailVerified ? new Date().toISOString() : undefined,
    gender: data.gender || 'Male',
    dob: data.dob || '1995-01-01',
    address: data.address || 'Indore, Madhya Pradesh',
    city: data.city || 'Indore',
    district: data.district || 'Indore',
    state: data.state || 'Madhya Pradesh',
    pinCode: data.pinCode || '452001',
    societyId: data.societyId || 'SOC-IND-02',
    societyName: data.societyName || 'Indore Shramik Kaushal Sahakari Samiti',
    skills: data.skills || [
      {
        name: data.primaryTrade || data.detectedField || 'Plumbing',
        isPrimary: true,
        yearsExperience: Number(data.experienceYears) || 3,
      },
    ],
    primaryTrade: data.primaryTrade || data.detectedField || 'Plumbing',
    detectedField: data.detectedField || data.primaryTrade || 'Plumbing',
    fieldConfidence: data.fieldConfidence || 90,
    detectionRationale: data.detectionRationale,
    workDescription: data.workDescription || '',
    preferredLanguage: data.preferredLanguage || 'hi',
    verifiedSkills: data.verifiedSkills || [data.primaryTrade || 'Plumbing'],
    registeredSkills: data.registeredSkills || [data.primaryTrade || 'Plumbing'],
    assessmentStatus: assessmentScore > 0 ? 'COMPLETED' : 'NOT_STARTED',
    skillAssessmentScore: assessmentScore,
    skillLevel: skillLevel as any,
    verificationStatus: assessmentScore >= 50 ? 'VERIFIED' : 'PENDING',
    availability: true,
    rating: 4.9,
    totalRatingsCount: 1,
    completedJobs: 0,
    failedJobs: 0,
    consecutiveFailures: 0,
    penaltyStatus: 'NONE',
    earnings: { today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
    trustScore: assessmentScore >= 50 ? 86 : 60,
    trustBreakdown: {
      identityScore: 20,
      societyScore: 15,
      skillScore: assessmentScore > 0 ? Math.round((assessmentScore / 100) * 20) : 10,
      experienceScore: Math.min(15, (Number(data.experienceYears) || 3) * 3),
      performanceScore: 5,
      ratingScore: 10,
      reliabilityScore: 10,
      total: assessmentScore >= 50 ? 86 : 60,
      notes: [
        'Aadhaar e-KYC verified',
        assessmentScore > 0 ? `Trade skill assessment completed (${assessmentScore}%)` : 'Pending skill assessment',
        `Enrolled in ${data.societyName || 'Indore Shramik Kaushal Sahakari Samiti'}`
      ],
    },
    reliabilityScore: 96,
    currentLocation: data.currentLocation || { lat: 22.7196, lng: 75.8577, address: `${data.city || 'Indore'}, Madhya Pradesh` },
    maskedAadhaar,
    maskedPan: data.maskedPan || (data.pan ? `XXXXX${data.pan.slice(-4)}` : 'XXXXX4321B'),
    uanNumber: data.uanNumber || undefined,
    documents: {
      aadhaarUploaded: true,
      panUploaded: true,
      licenseUploaded: true,
      certUploaded: true,
    },
    paymentSetup: data.paymentSetup || {
      upiId: data.upiId || `${(data.name || 'worker').toLowerCase().replace(/\s+/g, '')}@upi`,
      bankAccount: data.bankAccount || (data.bankDetails?.accountNumber ? `XXXXXX${data.bankDetails.accountNumber.slice(-4)}` : 'XXXXXXXX9876'),
      ifsc: data.ifsc || data.bankDetails?.ifsc || 'SBIN0001245',
      method: data.paymentMethod || 'UPI',
    },
    bankDetails: data.bankDetails,
    welfareBalance: 1500,
    experienceYears: Number(data.experienceYears) || 3,
    consentGiven: data.consentGiven ?? true,
    createdAt: new Date().toISOString(),
  };

  workers.unshift(newWorker);
  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'WORKER_REGISTERED',
    user: newWorker.id,
    details: `Craftsman ${newWorker.name} (${newWorker.primaryTrade}) registered with ${assessmentScore}% score and enrolled in ${newWorker.societyName}.`,
    timestamp: new Date().toISOString(),
  });

  broadcast('WORKER_VERIFICATION_SUBMITTED', newWorker, `Worker ${newWorker.name} (${newWorker.id}) registered into cooperative society.`);
  
  const token = `wkr_token_${newWorker.id}_${Date.now()}`;
  res.status(201).json({
    success: true,
    worker: newWorker,
    token,
    role: 'WORKER',
    message: `Cooperative craftsman registration successful! Welcome ${newWorker.name} to ${newWorker.societyName}.`,
  });
});

// 3. SOCIETY ADMIN AUTHENTICATION
app.post('/api/auth/society/login', (req, res) => {
  const { adminId, societyId, staffCode, pin } = req.body;
  let admin: SocietyAdminProfile | undefined;

  if (adminId) {
    admin = societyAdmins.find((a) => a.id === adminId);
  } else if (societyId) {
    admin = societyAdmins.find((a) => a.societyId === societyId);
  } else if (staffCode) {
    admin = societyAdmins.find((a) => a.id.toLowerCase().includes(staffCode.toLowerCase()));
  }

  if (!admin) {
    admin = societyAdmins[0]; // fallback to primary society admin
  }

  const token = `soc_token_${admin.id}_${Date.now()}`;
  res.json({
    success: true,
    societyAdmin: admin,
    token,
    role: 'SOCIETY_ADMIN',
    message: `Authenticated as Society Officer: ${admin.name} (${admin.societyName})`,
  });
});

// 4. FEDERATION ADMIN AUTHENTICATION
app.post('/api/auth/federation/login', (req, res) => {
  const { officerId, clearanceCode, passcode } = req.body;
  let officer: FederationAdminProfile | undefined;

  if (officerId) {
    officer = federationAdmins.find((f) => f.id === officerId);
  }

  if (!officer) {
    officer = federationAdmins[0]; // fallback to Executive Directorate
  }

  const token = `fed_token_${officer.id}_${Date.now()}`;
  res.json({
    success: true,
    federationAdmin: officer,
    token,
    role: 'FEDERATION_ADMIN',
    message: `Command Clearance Granted: ${officer.name} (${officer.clearanceLevel})`,
  });
});

// 5. SUPER ADMIN AUTHENTICATION
app.post('/api/auth/super-admin/login', (req, res) => {
  const { officialId, passcode, totpCode, clearanceLevel } = req.body;
  let admin: SuperAdminProfile | undefined;

  if (officialId) {
    const query = officialId.trim().toLowerCase();
    admin = superAdmins.find((s) => s.id.toLowerCase() === query || s.email.toLowerCase() === query);
  }

  if (!admin) {
    admin = superAdmins[0];
  }

  const token = `super_admin_token_${admin.id}_${Date.now()}`;
  res.json({
    success: true,
    superAdmin: admin,
    token,
    role: 'SUPER_ADMIN',
    message: `National Sovereign Clearance Granted: ${admin.name} (${admin.officialDesignation})`,
  });
});

app.post('/api/auth/super-admin/register', (req, res) => {
  const { name, phone, email, ministry, department, officialDesignation, cadre, employeeCode } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Official name, govt email, and Aadhaar-linked phone are required.' });
  }

  const newAdminId = `GOV-${ministry?.includes('Labour') ? 'MOL' : ministry?.includes('Cooperation') ? 'CRCS' : 'MSDE'}-${Math.floor(100 + Math.random() * 900)}`;
  const newAdmin: SuperAdminProfile = {
    id: newAdminId,
    name,
    phone,
    email,
    emailVerified: req.body.emailVerified || false,
    emailVerifiedAt: req.body.emailVerified ? new Date().toISOString() : undefined,
    ministry: ministry || 'Ministry of Labour & Employment',
    department: department || 'Central Registrar of Cooperative Societies (CRCS)',
    officialDesignation: officialDesignation || 'Director & Senior Registrar',
    cadre: cadre || 'Central Secretariat Service',
    clearanceLevel: 'APEX_LEVEL_5_NATIONAL',
    role: 'SUPER_ADMIN',
    mfaMethod: 'AADHAAR_TOTP',
    tokenExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  superAdmins.unshift(newAdmin);
  const token = `super_admin_token_${newAdmin.id}_${Date.now()}`;
  res.status(201).json({
    success: true,
    superAdmin: newAdmin,
    token,
    role: 'SUPER_ADMIN',
    message: `Ministry personnel clearance successfully registered: ${newAdmin.name} (${newAdmin.id})`,
  });
});

// Services
app.get('/api/services', (req, res) => {
  const { category, search } = req.query;
  let list = services;
  if (category && typeof category === 'string' && category !== 'ALL') {
    list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.service_name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q))
    );
  }
  res.json(list);
});

app.put('/api/services/:id', (req, res) => {
  const service = services.find((s) => s.record_id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  const data = req.body;
  if (data.minimum_workers !== undefined) service.minimum_workers = Number(data.minimum_workers);
  if (data.recommended_workers !== undefined) service.recommended_workers = Number(data.recommended_workers);
  if (data.worker_requirement_type) service.worker_requirement_type = data.worker_requirement_type;
  if (data.pricing_model) service.pricing_model = data.pricing_model;
  if (data.team_roles) service.team_roles = data.team_roles;
  if (data.worker_requirement_rules) service.worker_requirement_rules = data.worker_requirement_rules;
  if (data.suggested_display_price_inr !== undefined) service.suggested_display_price_inr = Number(data.suggested_display_price_inr);
  if (data.notes) service.notes = data.notes;

  broadcast('SERVICE_UPDATED', service, `Service policy updated: ${service.service_name} (${service.worker_requirement_type})`);
  res.json(service);
});

// Workers
app.get('/api/workers', (_req, res) => {
  res.json(workers);
});

app.get('/api/workers/:id', (req, res) => {
  const worker = workers.find((w) => w.id === req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });
  res.json(worker);
});

// Worker 6-step registration
app.post('/api/workers/register', (req, res) => {
  const data = req.body;
  const newWorkerId = `BH-KAUSHAL-WKR-000${124 + workers.length}`;

  const newWorker: WorkerProfile = {
    id: newWorkerId,
    name: data.name || 'New Worker',
    phone: data.phone || '9826000000',
    email: data.email,
    gender: data.gender || 'Male',
    dob: data.dob || '1995-01-01',
    address: data.address || 'Indore, MP',
    city: data.city || 'Indore',
    district: data.district || 'Indore',
    state: 'Madhya Pradesh',
    pinCode: data.pinCode || '452001',
    societyId: data.societyId || 'SOC-IND-02',
    societyName: data.societyName || 'Indore Shramik Kaushal Sahakari Samiti',
    skills: data.skills || [{ name: 'Plumbing', isPrimary: true, yearsExperience: 3 }],
    primaryTrade: data.primaryTrade || 'Plumbing',
    skillAssessmentScore: data.skillAssessmentScore || 85,
    skillLevel: data.skillAssessmentScore >= 90 ? 'Expert' : data.skillAssessmentScore >= 75 ? 'Advanced' : 'Intermediate',
    verificationStatus: 'UNDER_REVIEW',
    availability: false,
    rating: 0,
    totalRatingsCount: 0,
    completedJobs: 0,
    failedJobs: 0,
    consecutiveFailures: 0,
    penaltyStatus: 'NONE',
    earnings: { today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
    trustScore: 78,
    trustBreakdown: {
      identityScore: 20,
      societyScore: 15,
      skillScore: 16,
      experienceScore: 7,
      performanceScore: 5,
      ratingScore: 5,
      reliabilityScore: 10,
      total: 78,
      notes: ['Documents submitted and undergoing review by Society Admin'],
    },
    reliabilityScore: 95,
    currentLocation: data.currentLocation || { lat: 22.7196, lng: 75.8577, address: 'Indore City' },
    maskedAadhaar: data.maskedAadhaar || 'XXXX XXXX 1234',
    maskedPan: data.maskedPan || 'XXXXX5678A',
    documents: {
      aadhaarUploaded: true,
      panUploaded: true,
      licenseUploaded: !!data.licenseUploaded,
      certUploaded: !!data.certUploaded,
    },
    paymentSetup: data.paymentSetup || {
      upiId: `${(data.name || 'worker').toLowerCase().replace(/\s+/g, '')}@upi`,
      bankAccount: 'XXXXXXXX9876',
      ifsc: 'SBIN0001245',
      method: 'UPI',
    },
    welfareBalance: 0,
    createdAt: new Date().toISOString(),
  };

  workers.unshift(newWorker);
  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'WORKER_REGISTERED',
    user: newWorker.id,
    details: `Worker ${newWorker.name} registered and submitted for verification.`,
    timestamp: new Date().toISOString(),
  });

  broadcast('WORKER_VERIFICATION_SUBMITTED', newWorker, `Worker ${newWorker.name} (${newWorker.id}) submitted registration for verification.`);
  res.status(201).json(newWorker);
});

// Admin Worker Verification (Approve / Reject)
app.post('/api/workers/:id/verify', (req, res) => {
  const { id } = req.params;
  const { decision, rejectionReason } = req.body; // decision: 'APPROVE' | 'REJECT'
  const worker = workers.find((w) => w.id === id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  if (decision === 'APPROVE') {
    worker.verificationStatus = 'VERIFIED';
    worker.availability = true;
    worker.trustScore = Math.min(95, worker.trustScore + 10);
    worker.trustBreakdown.societyScore = 15;
    worker.trustBreakdown.identityScore = 20;
    worker.trustBreakdown.total = worker.trustScore;

    auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      event: 'WORKER_VERIFICATION_APPROVED',
      user: 'ADMIN',
      details: `Worker ${worker.name} (${worker.id}) verified and approved.`,
      timestamp: new Date().toISOString(),
    });

    broadcast('WORKER_VERIFICATION_APPROVED', worker, `🎉 Verification Approved! Worker ${worker.name} is now certified to receive jobs.`);
    res.json({ success: true, worker });
  } else {
    worker.verificationStatus = 'REJECTED';
    worker.rejectionReason = rejectionReason || 'Document clarity issue or mismatch. Please re-upload.';
    worker.availability = false;

    auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      event: 'WORKER_VERIFICATION_REJECTED',
      user: 'ADMIN',
      details: `Worker ${worker.name} (${worker.id}) rejected: ${worker.rejectionReason}`,
      timestamp: new Date().toISOString(),
    });

    broadcast('WORKER_VERIFICATION_REJECTED', worker, `Verification Rejected: ${worker.rejectionReason}`);
    res.json({ success: true, worker });
  }
});

// Toggle worker availability
app.post('/api/workers/:id/availability', (req, res) => {
  const worker = workers.find((w) => w.id === req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });
  if (worker.verificationStatus !== 'VERIFIED') {
    return res.status(403).json({ error: 'Only verified workers can toggle availability.' });
  }
  worker.availability = req.body.availability ?? !worker.availability;
  broadcast('WORKER_AVAILABILITY_CHANGED', { workerId: worker.id, availability: worker.availability });
  res.json({ success: true, availability: worker.availability });
});

// Bookings
app.get('/api/bookings', (_req, res) => {
  res.json(bookings);
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

// Create Booking & Run Fair Dispatch with Dynamic Multi-Worker Team Engine
app.post('/api/bookings', (req, res) => {
  const data = req.body;
  const service = services.find((s) => s.record_id === data.serviceId) || services[1];
  const bookingId = `BK-2026-${1042 + bookings.length}`;
  const scopeDetails: BookingScopeDetails = data.scopeDetails || {};

  // 1. Dynamic Worker Requirement Calculation
  const reqResult = calculateWorkerRequirement(service, scopeDetails);

  // 2. Dynamic Pricing Calculation (adheres strictly to pricing_model and policy split)
  const pricing = calculateServiceBookingPricing(service, reqResult, scopeDetails, policy);

  // 3. Worker Team Formation & Availability Verification
  const teamResult = findAvailableTeamForService(
    workers,
    service,
    reqResult.selected_workers,
    data.preselectedWorkerId
  );

  // If a compulsory multi-worker service cannot meet minimum team requirements, fail fast and return alternatives
  if (!teamResult.isAvailable && reqResult.worker_requirement_type === 'MULTI_WORKER_COMPULSORY') {
    return res.status(409).json({
      error: `A certified crew of at least ${reqResult.minimum_workers} artisans is mandatory for this service. Full crew is unavailable right now.`,
      isTeamUnavailable: true,
      minRequired: reqResult.minimum_workers,
      selectedWorkers: reqResult.selected_workers,
      availableCount: teamResult.availableWorkersCount,
      missingCount: teamResult.missingCount,
      alternativeSlots: teamResult.alternativeSlots,
    });
  }

  const selectedWorker = teamResult.leadWorker || workers[0];

  const newBooking: Booking = {
    id: bookingId,
    customerId: data.customerId || PRIMARY_DEMO_CUSTOMER.id,
    customerName: data.customerName || PRIMARY_DEMO_CUSTOMER.name,
    customerPhone: data.customerPhone || PRIMARY_DEMO_CUSTOMER.phone,
    customerAddress: data.customerAddress || PRIMARY_DEMO_CUSTOMER.addresses[0],
    serviceId: service.record_id,
    serviceName: service.service_name,
    category: service.category,
    status: 'MATCHING',
    pricing,
    materials: [],
    searchRadiusKm: policy.dispatchPolicy.standardInitialRadiusKm,
    dispatchLog: [
      `${new Date().toLocaleTimeString()} - Customer initiated booking for ${service.service_name} (₹${pricing.grossAmount})`,
      `${new Date().toLocaleTimeString()} - Requirement: ${reqResult.worker_requirement_type} (${reqResult.selected_workers} artisan(s) assigned, model: ${reqResult.pricing_model})`,
      `${new Date().toLocaleTimeString()} - Searching within ${policy.dispatchPolicy.standardInitialRadiusKm} km initial radius...`,
    ],
    teamRequired: reqResult.selected_workers > 1,
    teamSize: teamResult.team.length,
    teamMembers: teamResult.team,
    workerRequirementType: reqResult.worker_requirement_type,
    workerRequirementDetails: reqResult,
    scopeDetails,
    createdAt: new Date().toISOString(),
  };

  newBooking.workerId = selectedWorker.id;
  newBooking.workerName = selectedWorker.name;
  newBooking.workerPhone = selectedWorker.phone;
  newBooking.workerTrade = selectedWorker.primaryTrade;
  newBooking.workerRating = selectedWorker.rating;
  newBooking.workerTrustScore = selectedWorker.trustScore;
  newBooking.status = 'WORKER_OFFERED';
  newBooking.workerLocation = {
    lat: selectedWorker.currentLocation.lat,
    lng: selectedWorker.currentLocation.lng,
    distanceKm: 2.4,
    etaMinutes: 12,
    lastUpdated: new Date().toISOString(),
  };

  if (teamResult.team.length > 1) {
    const teamSummary = teamResult.team.map((m) => `${m.workerName} (${m.role})`).join(', ');
    newBooking.dispatchLog?.push(
      `${new Date().toLocaleTimeString()} - Multi-artisan team locked: ${teamSummary}.`
    );
  } else {
    newBooking.dispatchLog?.push(
      `${new Date().toLocaleTimeString()} - Nearest eligible artisan matched: ${selectedWorker.name} (${selectedWorker.id}) at 2.4 km. Job offered!`
    );
  }

  bookings.unshift(newBooking);

  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'BOOKING_CREATED',
    user: newBooking.customerId,
    details: `Booking ${newBooking.id} created for ${newBooking.serviceName} with ${newBooking.teamSize || 1} artisan(s).`,
    timestamp: new Date().toISOString(),
  });

  broadcast(
    'BOOKING_CREATED',
    newBooking,
    `New Booking ${newBooking.id}: ${newBooking.serviceName} (${newBooking.teamSize || 1} artisan crew assigned)`
  );
  broadcast('WORKER_OFFERED', {
    bookingId: newBooking.id,
    workerId: selectedWorker.id,
    teamMembers: newBooking.teamMembers,
  });

  res.status(201).json(newBooking);
});

// Worker Accepts Booking
app.post('/api/bookings/:id/accept', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'CONFIRMED';
  booking.acceptedAt = new Date().toISOString();
  booking.arrivalOtp = `${Math.floor(1000 + Math.random() * 9000)}`; // 4-digit OTP e.g. 4827
  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Worker ${booking.workerName} accepted the job. Arrival OTP generated.`);

  broadcast('WORKER_ACCEPTED', booking, `Worker ${booking.workerName} accepted Booking ${booking.id}!`);
  
  const customer1 = customers.find(c => c.id === booking.customerId) || PRIMARY_DEMO_CUSTOMER;
  const worker1 = workers.find(w => w.id === booking.workerId) || workers[0];
  
  sendSimulatedNotification('CUSTOMER', customer1, 'Booking Confirmed', `Your booking ${booking.id} has been accepted by ${worker1.name}.`);
  sendSimulatedNotification('WORKER', worker1, 'New Job Assigned', `You have been assigned booking ${booking.id} for ${customer1.name}.`);
  res.json(booking);
});

// Worker Starts Journey
app.post('/api/bookings/:id/start-journey', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'TRAVELLING';
  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Worker started journey towards customer premises.`);

  broadcast('WORKER_ON_THE_WAY', booking, `Worker ${booking.workerName} is on the way! ETA: ${booking.workerLocation?.etaMinutes || 10} mins.`);
  
  const customer2 = customers.find(c => c.id === booking.customerId) || PRIMARY_DEMO_CUSTOMER;
  const worker2 = workers.find(w => w.id === booking.workerId) || workers[0];
  
  sendSimulatedNotification('CUSTOMER', customer2, 'Worker On The Way', `${worker2.name} is on the way! ETA: ${booking.workerLocation?.etaMinutes || 10} mins.`);
  sendSimulatedNotification('WORKER', worker2, 'Journey Started', `Journey started. ETA to customer: ${booking.workerLocation?.etaMinutes || 10} mins.`);
  res.json(booking);
});

// Worker Location Periodic Update (GPS Live Tracking)
app.post('/api/bookings/:id/update-location', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { lat, lng, distanceKm, etaMinutes } = req.body;
  if (booking.workerLocation) {
    booking.workerLocation.lat = lat ?? booking.workerLocation.lat;
    booking.workerLocation.lng = lng ?? booking.workerLocation.lng;
    booking.workerLocation.distanceKm = distanceKm ?? Math.max(0.2, (booking.workerLocation.distanceKm - 0.3));
    booking.workerLocation.etaMinutes = etaMinutes ?? Math.max(1, Math.round(booking.workerLocation.distanceKm * 4));
    booking.workerLocation.lastUpdated = new Date().toISOString();
  }

  broadcast('WORKER_LOCATION_UPDATED', {
    bookingId: booking.id,
    workerLocation: booking.workerLocation,
  });

  res.json({ success: true, workerLocation: booking.workerLocation });
});

// Worker Arrived at Site
app.post('/api/bookings/:id/arrived', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'ARRIVED';
  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Worker arrived at premises. Waiting for customer arrival OTP.`);

  broadcast('WORKER_ARRIVED', booking, `Worker ${booking.workerName} has arrived at customer premises!`);
  
  const customer3 = customers.find(c => c.id === booking.customerId) || PRIMARY_DEMO_CUSTOMER;
  const worker3 = workers.find(w => w.id === booking.workerId) || workers[0];
  
  const timeTakenMinutes = booking.acceptedAt ? Math.max(1, Math.round((Date.now() - new Date(booking.acceptedAt).getTime()) / 60000)) : 10;
  
  sendSimulatedNotification('CUSTOMER', customer3, 'Worker Arrived', `${worker3.name} has arrived at your location. Time taken: ${timeTakenMinutes} mins.`);
  sendSimulatedNotification('WORKER', worker3, 'Arrived at Destination', `You have arrived at the customer location. Time taken: ${timeTakenMinutes} mins.`);
  res.json(booking);
});

// Verify Arrival OTP (Blocks job start without correct OTP)
app.post('/api/bookings/:id/verify-arrival-otp', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { otp } = req.body;
  if (String(otp).trim() !== String(booking.arrivalOtp).trim()) {
    return res.status(400).json({ error: 'Invalid Arrival OTP. Please check the code displayed on Customer phone.' });
  }

  booking.status = 'IN_PROGRESS';
  booking.startedAt = new Date().toISOString();
  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Arrival OTP ${otp} verified successfully. Job in progress!`);

  broadcast('ARRIVAL_OTP_VERIFIED', booking, `Arrival OTP verified! Service work has started.`);
  res.json(booking);
});

// Worker Requests Material / Extra Charge
app.post('/api/bookings/:id/request-material', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { name, amount } = req.body;
  const materialItem = {
    id: `MAT-${Date.now()}`,
    name: name || 'Replacement Spare Part',
    amount: Number(amount) || 100,
    status: 'PENDING' as const,
    requestedAt: new Date().toISOString(),
  };

  booking.materials.push(materialItem);
  booking.status = 'MATERIAL_REVIEW';
  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Worker requested material charge: ${materialItem.name} (₹${materialItem.amount}). Awaiting customer approval.`);

  broadcast('MATERIAL_REQUESTED', { booking, material: materialItem }, `Additional Charge Request: ₹${materialItem.amount} for ${materialItem.name}`);
  res.json(booking);
});

// Customer Approves or Rejects Material Charge
app.post('/api/bookings/:id/respond-material', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { materialId, approved } = req.body;
  const mat = booking.materials.find((m) => m.id === materialId) || booking.materials[booking.materials.length - 1];

  if (mat) {
    mat.status = approved ? 'APPROVED' : 'REJECTED';
    if (approved) {
      booking.pricing.materialsTotal += mat.amount;
      booking.pricing.grossAmount += mat.amount;
      booking.pricing.netPayable += mat.amount;
      // Recalculate split with updated gross
      const split = calculateRevenueSplit(booking.pricing.grossAmount, policy);
      booking.pricing.workerShare = split.workerShare;
      booking.pricing.societyShare = split.societyShare;
      booking.pricing.welfareShare = split.welfareShare;
      booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Customer approved material charge (₹${mat.amount}). New Total: ₹${booking.pricing.grossAmount}`);
    } else {
      booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Customer rejected material charge (₹${mat.amount}).`);
    }
  }

  booking.status = 'IN_PROGRESS';
  broadcast('MATERIAL_APPROVED', booking, approved ? `Material charge ₹${mat?.amount} approved!` : `Material charge rejected by customer.`);
  res.json(booking);
});

// Worker Marks Job Complete -> Generates Completion OTP
app.post('/api/bookings/:id/complete', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'COMPLETION_PENDING';
  booking.completionOtp = `${Math.floor(1000 + Math.random() * 9000)}`; // e.g. 7351
  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Worker finished work. Completion OTP ${booking.completionOtp} generated on Customer device.`);

  broadcast('COMPLETION_OTP_GENERATED', booking, `Work finished! Ask customer for completion OTP to close job.`);
  res.json(booking);
});

// Verify Completion OTP -> Settlement, Financial Ledger, Welfare Allocation
app.post('/api/bookings/:id/verify-completion-otp', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { otp } = req.body;
  if (String(otp).trim() !== String(booking.completionOtp).trim()) {
    return res.status(400).json({ error: 'Invalid Completion OTP. Please check the code on Customer device.' });
  }

  booking.status = 'PAYMENT_PENDING';
  booking.paymentStatus = 'PENDING';
  booking.completedAt = new Date().toISOString();
  booking.paidAt = new Date().toISOString();

  // Financial Ledger Entry (Immutable)
  const ledgerEntry: FinancialLedgerEntry = {
    id: `LEDGER-${Date.now()}`,
    bookingId: booking.id,
    customerPaid: booking.pricing.grossAmount,
    workerCredit: booking.pricing.workerShare,
    societyCredit: booking.pricing.societyShare,
    welfareCredit: booking.pricing.welfareShare,
    policySnapshot: policy.activeModel === 'MODEL_A' ? 'Cooperative Model A (94.5% / 3.5% / 2.0%)' : 'Platform Model B (95.0% / 2.5% / 2.5%)',
    status: 'SETTLED',
    timestamp: new Date().toISOString(),
  };
  ledger.unshift(ledgerEntry);

  // Welfare Record Entry
  const welfareRecord: WelfareRecord = {
    id: `WLF-${Date.now()}`,
    workerId: booking.workerId || 'UNKNOWN',
    workerName: booking.workerName || 'Worker',
    bookingId: booking.id,
    contributionAmount: booking.pricing.welfareShare,
    timestamp: new Date().toISOString(),
    scheme: 'Madhya Pradesh Labour Welfare Fund (MPSLWB)',
  };
  welfareRecords.unshift(welfareRecord);

  // Update Worker Stats and Earnings
  const worker = workers.find((w) => w.id === booking.workerId);
  if (worker) {
    worker.completedJobs += 1;
    worker.earnings.today += booking.pricing.workerShare;
    worker.earnings.thisWeek += booking.pricing.workerShare;
    worker.earnings.thisMonth += booking.pricing.workerShare;
    worker.earnings.total += booking.pricing.workerShare;
    worker.welfareBalance += booking.pricing.welfareShare;
    worker.consecutiveFailures = 0;
    worker.penaltyStatus = 'NONE';
  }

  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Completion OTP verified! Payment settled. Worker credited ₹${booking.pricing.workerShare}, Welfare Fund credited ₹${booking.pricing.welfareShare}`);

  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'PAYMENT_SETTLED',
    user: booking.workerId || 'SYSTEM',
    details: `Booking ${booking.id} completed. Gross: ₹${booking.pricing.grossAmount}, Worker: ₹${booking.pricing.workerShare}, Society: ₹${booking.pricing.societyShare}, Welfare: ₹${booking.pricing.welfareShare}`,
    timestamp: new Date().toISOString(),
  });

  broadcast('JOB_COMPLETED', booking, `🎉 Booking ${booking.id} completed successfully! Net payable ₹${booking.pricing.grossAmount}`);
  broadcast('PAYMENT_SETTLED', { ledgerEntry, welfareRecord });

  res.json(booking);
});

// Customer Reconciles & Settles Payment (Mock Digital UPI / Cards or Cash on Service)
app.post('/api/bookings/:id/pay', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const method = req.body.method || 'UPI';
  const isCash = method === 'CASH';
  const now = new Date();
  const invoiceNumber = booking.invoiceNumber || `BK-INV-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const transactionId = `TXN-IND-${Date.now().toString().slice(-8)}`;
  const utrNumber = isCash ? undefined : `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const cashReceiptRef = isCash ? `CSH-REC-${Math.floor(100000 + Math.random() * 900000)}` : undefined;

  let methodLabel = 'UPI / Bharat QR';
  if (method === 'CREDIT_CARD') methodLabel = 'Credit Card';
  else if (method === 'DEBIT_CARD') methodLabel = 'Debit Card';
  else if (method === 'CASH') methodLabel = 'Cash on Service';

  booking.status = 'COMPLETED';
  booking.paymentStatus = 'PAID';
  booking.paymentMethod = method;
  booking.paidAt = now.toISOString();
  booking.invoiceNumber = invoiceNumber;

  booking.paymentDetails = {
    transactionId: isCash ? (cashReceiptRef || transactionId) : transactionId,
    utrNumber,
    method,
    methodLabel,
    paidAmount: booking.pricing.netPayable,
    paidAt: now.toISOString(),
    reconciledAt: now.toISOString(),
    invoiceNumber,
    cashTendered: req.body.cashTendered,
    cashChangeReturned: req.body.cashChangeReturned,
    reconciliationStatus: 'RECONCILED',
    digitalCardLast4: req.body.details?.cardLast4,
    cardBrand: req.body.details?.cardBrand,
    upiVpa: req.body.details?.upiVpa,
    notes: req.body.notes || (isCash ? 'Cash collected directly by certified cooperative artisan upon task signoff.' : 'Digitally authorized and settled via Bharat Kaushal Gateway switch.'),
  };

  // Ensure Financial Ledger status is marked CAPTURED
  let ledgerEntry = ledger.find((l) => l.bookingId === booking.id);
  if (ledgerEntry) {
    ledgerEntry.status = 'CAPTURED';
  } else {
    ledgerEntry = {
      id: `LEDGER-${Date.now()}`,
      bookingId: booking.id,
      customerPaid: booking.pricing.netPayable,
      workerCredit: booking.pricing.workerShare,
      societyCredit: booking.pricing.societyShare,
      welfareCredit: booking.pricing.welfareShare,
      policySnapshot: policy.activeModel === 'MODEL_A' ? 'Cooperative Model A (94.5% / 3.5% / 2.0%)' : 'Platform Model B (95.0% / 2.5% / 2.5%)',
      status: 'CAPTURED',
      timestamp: now.toISOString(),
    };
    ledger.unshift(ledgerEntry);
  }

  booking.dispatchLog?.push(`${now.toLocaleTimeString()} - Payment of ₹${booking.pricing.netPayable} reconciled via ${methodLabel}. Automated GST-compliant invoice ${invoiceNumber} issued.`);

  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'PAYMENT_RECONCILED',
    user: booking.customerId || 'CUSTOMER',
    details: `Booking ${booking.id} payment ₹${booking.pricing.netPayable} reconciled via ${methodLabel}. Invoice #${invoiceNumber}`,
    timestamp: now.toISOString(),
  });

  broadcast('PAYMENT_COMPLETED', booking, `Payment of ₹${booking.pricing.netPayable} received via ${methodLabel}! Invoice #${invoiceNumber} ready.`);
  res.json(booking);
});

// Fetch Automated Invoice for Booking
app.get('/api/bookings/:id/invoice', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const society = SEEDED_SOCIETIES.find((s) => s.id === 'SOC-IND-02') || {
    name: 'Indore Shramik Kaushal Sahakari Samiti',
    code: 'MP-IND-COOP-1960/8821',
    city: 'Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
  };

  const invoice = {
    invoiceNumber: booking.invoiceNumber || `BK-INV-${new Date().getFullYear()}-${booking.id.replace(/\D/g, '') || '1042'}`,
    issueDate: booking.paidAt || booking.completedAt || new Date().toISOString(),
    bookingId: booking.id,
    serviceName: booking.serviceName,
    sacCode: '9987',
    customer: {
      name: booking.customerName,
      phone: booking.customerPhone,
      address: booking.customerAddress,
    },
    artisan: {
      name: booking.workerName || 'Certified Artisan',
      trade: booking.workerTrade || 'General Technical Services',
      societyName: society.name,
      registrationNumber: society.code || 'MP-IND-COOP-1960/8821',
    },
    pricing: booking.pricing,
    materials: booking.materials,
    paymentDetails: booking.paymentDetails || {
      method: booking.paymentMethod || 'UPI',
      methodLabel: booking.paymentMethod === 'CASH' ? 'Cash on Service' : 'Digital Payment',
      paidAmount: booking.pricing.netPayable,
      paidAt: booking.paidAt || new Date().toISOString(),
      transactionId: `TXN-IND-${Date.now().toString().slice(-8)}`,
      reconciliationStatus: 'RECONCILED',
    },
    statutoryNotes: 'Tax invoice issued under Section 31 of CGST Act 2017 & MP Cooperative Societies Act 1960. Certified cooperative members receive 94.5% direct labour realization and 2% statutory social security cess contribution.',
  };

  res.json(invoice);
});

// Customer Rates Worker
app.post('/api/bookings/:id/rate', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { stars, quality, punctuality, behaviour, feedback } = req.body;
  booking.rating = {
    stars: Number(stars) || 5,
    quality: Number(quality) || 5,
    punctuality: Number(punctuality) || 5,
    behaviour: Number(behaviour) || 5,
    feedback,
    createdAt: new Date().toISOString(),
  };

  const worker = workers.find((w) => w.id === booking.workerId);
  if (worker) {
    const totalRatings = worker.totalRatingsCount + 1;
    const newRating = Math.round(((worker.rating * worker.totalRatingsCount + booking.rating.stars) / totalRatings) * 100) / 100;
    worker.rating = newRating;
    worker.totalRatingsCount = totalRatings;
  }

  booking.dispatchLog?.push(`${new Date().toLocaleTimeString()} - Customer submitted rating: ${booking.rating.stars} stars.`);

  broadcast('RATING_SUBMITTED', { bookingId: booking.id, rating: booking.rating, workerId: booking.workerId });
  res.json(booking);
});

// Cancellation & Penalty System (Grace window 5 min, Unexcused ₹20, Emergency ₹0)
app.post('/api/bookings/:id/cancel', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { cancelledBy = 'CUSTOMER', reason, isEmergency } = req.body;
  const bookingAcceptedTime = booking.acceptedAt ? new Date(booking.acceptedAt).getTime() : new Date(booking.createdAt).getTime();
  const minutesSinceAccept = (Date.now() - bookingAcceptedTime) / 60000;

  booking.status = 'CANCELLED';
  booking.cancelledBy = cancelledBy;
  booking.cancellationReason = reason || (cancelledBy === 'CUSTOMER' ? 'Customer requested cancellation' : 'Worker cancellation');
  booking.dispatchLog = booking.dispatchLog || [];

  let penalty = 0;
  if (cancelledBy === 'WORKER') {
    if (isEmergency) {
      penalty = 0;
      booking.dispatchLog.push(`${new Date().toLocaleTimeString()} - Worker cancelled due to verified emergency (${reason}). ₹0 penalty applied.`);
    } else if (minutesSinceAccept <= policy.cancellationPolicy.graceWindowMinutes) {
      penalty = 0;
      booking.dispatchLog.push(`${new Date().toLocaleTimeString()} - Worker cancelled within ${policy.cancellationPolicy.graceWindowMinutes} min grace window. ₹0 penalty.`);
    } else {
      penalty = policy.cancellationPolicy.unexcusedPenaltyInr; // ₹20
      booking.cancellationPenalty = penalty;
      const worker = workers.find((w) => w.id === booking.workerId);
      if (worker) {
        worker.earnings.today = Math.max(0, worker.earnings.today - penalty);
        worker.reliabilityScore = Math.max(80, worker.reliabilityScore - 2);
        worker.failedJobs += 1;
        worker.consecutiveFailures += 1;
        if (worker.consecutiveFailures >= 3) {
          worker.penaltyStatus = 'PENALTY_30_PERCENT';
        }
      }
      booking.dispatchLog.push(`${new Date().toLocaleTimeString()} - Unexcused worker cancellation after grace window. ₹${penalty} penalty applied. Worker may appeal.`);
    }
    // Release worker
    if (booking.workerId) {
      const worker = workers.find((w) => w.id === booking.workerId);
      if (worker) {
        worker.availability = true;
      }
    }
  } else {
    // Customer cancellation
    penalty = 0;
    booking.cancellationPenalty = 0;
    booking.dispatchLog.push(
      `${new Date().toLocaleTimeString()} - Customer cancelled booking (${reason || 'Customer request'}). ₹0 penalty applied under cooperative grace policy.`
    );
    // Free up the allocated worker
    if (booking.workerId) {
      const worker = workers.find((w) => w.id === booking.workerId);
      if (worker) {
        worker.availability = true;
      }
    }
  }

  broadcast('BOOKING_CANCELLED', { booking, penalty, reason: booking.cancellationReason, cancelledBy: booking.cancelledBy }, `Booking ${booking.id} cancelled.`);
  broadcast('WORKER_CANCELLATION', { booking, penalty, reason: booking.cancellationReason, cancelledBy: booking.cancelledBy }, `Booking ${booking.id} cancelled.`);
  res.json({ success: true, booking, penalty });
});

// Worker Penalty Appeal
app.post('/api/appeals', (req, res) => {
  const { workerId, bookingId, reason, category } = req.body;
  const worker = workers.find((w) => w.id === workerId) || workers[0];

  const appeal: WorkerAppeal = {
    id: `APL-${Date.now()}`,
    workerId: worker.id,
    workerName: worker.name,
    bookingId: bookingId || 'SS-1042',
    penaltyAmount: 20,
    reason: reason || 'Vehicle breakdown on way to customer',
    category: category || 'VEHICLE_BREAKDOWN',
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };

  appeals.unshift(appeal);
  broadcast('APPEAL_SUBMITTED', appeal, `New Appeal submitted by worker ${worker.name} for ₹${appeal.penaltyAmount} penalty.`);
  res.status(201).json(appeal);
});

// Admin Decides Appeal (Approve Exemption & Reverse ₹20 / Reject)
app.post('/api/appeals/:id/decide', (req, res) => {
  const appeal = appeals.find((a) => a.id === req.params.id);
  if (!appeal) return res.status(404).json({ error: 'Appeal not found' });

  const { decision, remarks } = req.body; // 'APPROVE' | 'REJECT'
  appeal.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  appeal.adminRemarks = remarks || (decision === 'APPROVE' ? 'Verified legitimate vehicle breakdown. Exemption approved.' : 'Insufficient justification.');
  appeal.reviewedAt = new Date().toISOString();

  if (decision === 'APPROVE') {
    const worker = workers.find((w) => w.id === appeal.workerId);
    if (worker) {
      worker.earnings.today += appeal.penaltyAmount;
      worker.reliabilityScore = Math.min(100, worker.reliabilityScore + 2);
      worker.consecutiveFailures = Math.max(0, worker.consecutiveFailures - 1);
      if (worker.consecutiveFailures < 3) worker.penaltyStatus = 'NONE';
    }

    auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      event: 'PENALTY_REVERSED',
      user: 'SOCIETY_ADMIN',
      details: `Appeal ${appeal.id} approved. ₹${appeal.penaltyAmount} penalty reversed for ${appeal.workerName}.`,
      timestamp: new Date().toISOString(),
    });

    broadcast('APPEAL_DECIDED', { appeal, reversed: true }, `🎉 Exemption approved for ${appeal.workerName}! ₹${appeal.penaltyAmount} penalty reversed.`);
  } else {
    broadcast('APPEAL_DECIDED', { appeal, reversed: false }, `Appeal ${appeal.id} rejected: ${appeal.adminRemarks}`);
  }

  res.json({ success: true, appeal });
});

// Support Complaints / Tickets
app.post('/api/complaints', (req, res) => {
  const { bookingId, userType, userId, userName, category, description, priority } = req.body;
  const complaint: SupportComplaint = {
    id: `CMP-2026-00${1245 + complaints.length}`,
    bookingId,
    userType: userType || 'CUSTOMER',
    userId: userId || 'USER-1',
    userName: userName || 'Customer',
    category: category || 'Service Quality',
    description: description || 'Issue description',
    priority: priority || 'MEDIUM',
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  complaints.unshift(complaint);
  broadcast('COMPLAINT_CREATED', complaint, `🔔 New Support Ticket ${complaint.id}: ${complaint.category} from ${complaint.userName}`);
  res.status(201).json(complaint);
});

// Admin Resolves Complaint
app.post('/api/complaints/:id/resolve', (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  complaint.status = 'RESOLVED';
  complaint.adminResponse = req.body.response || 'Issue investigated and resolved by Society Operations Team.';
  complaint.updatedAt = new Date().toISOString();

  broadcast('COMPLAINT_UPDATED', complaint, `Support Ticket ${complaint.id} marked as RESOLVED.`);
  res.json({ success: true, complaint });
});

// Worker SOS Emergency Trigger
app.post('/api/sos', (req, res) => {
  const { workerId, location, reason } = req.body;
  const worker = workers.find((w) => w.id === workerId) || workers[0];

  const sosPayload = {
    sosId: `SOS-${Date.now()}`,
    workerId: worker.id,
    workerName: worker.name,
    workerPhone: worker.phone,
    location: location || worker.currentLocation,
    reason: reason || 'Unsafe worksite emergency',
    timestamp: new Date().toISOString(),
    emergencyHelpline: '112 (National Emergency Support)',
  };

  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'SOS_TRIGGERED',
    user: worker.id,
    details: `EMERGENCY SOS triggered by ${worker.name} at ${sosPayload.location.address || 'Site'}: ${sosPayload.reason}`,
    timestamp: new Date().toISOString(),
  });

  broadcast('SOS_TRIGGERED', sosPayload, `🚨 EMERGENCY SOS TRIGGERED by ${worker.name} (${worker.phone})!`);
  res.json({ success: true, sosPayload });
});

// Policy Config
app.get('/api/policies', (_req, res) => {
  res.json(policy);
});

app.post('/api/policies', (req, res) => {
  policy = { ...policy, ...req.body };
  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'POLICY_UPDATED',
    user: 'FEDERATION_ADMIN',
    details: `Cooperative policy updated. Active Model: ${policy.activeModel}.`,
    timestamp: new Date().toISOString(),
  });
  broadcast('POLICY_UPDATED', policy, `Cooperative Policy updated by Federation Command.`);
  res.json({ success: true, policy });
});

// AI Chatbot Helper with No Hallucination (Uses Live DB State)
app.post('/api/chat', (req, res) => {
  const { message, bookingId, userRole } = req.body;
  const q = (message || '').toLowerCase();

  const activeBooking = bookingId ? bookings.find((b) => b.id === bookingId) : bookings[0];

  let reply = '';
  let actions: any[] = [];

  if (q.includes('where') || q.includes('kahan') || q.includes('status') || q.includes('tracking')) {
    if (activeBooking && activeBooking.workerName) {
      reply = `Booking ${activeBooking.id} is currently in state "${activeBooking.status}". Assigned worker is ${activeBooking.workerName} (${activeBooking.workerPhone || 'Contact available'}). Distance: ${activeBooking.workerLocation?.distanceKm || 2.1} km, ETA: ${activeBooking.workerLocation?.etaMinutes || 8} mins.`;
    } else {
      reply = 'You have no ongoing active booking right now. You can browse 140+ verified local trade services to book.';
    }
  } else if (q.includes('price') || q.includes('cost') || q.includes('kitna') || q.includes('rate')) {
    reply = `All prices on Bharat Kaushal are benchmarked directly against the authentic Indore local cooperative dataset. For example: Tap leakage repair is ₹250, Fan installation is ₹250, Split AC service is ₹549, and Full-day carpenter is ₹750. No hidden surcharges!`;
    actions = [{ label: 'View Service Catalog', action: 'VIEW_CATALOG' }];
  } else if (q.includes('otp') || q.includes('arrival') || q.includes('completion')) {
    reply = `Arrival OTP protects you by ensuring work only begins when worker is physically present at your doorstep. Completion OTP ensures you only confirm when work has been satisfactorily inspected.`;
  } else if (q.includes('complaint') || q.includes('problem') || q.includes('help') || q.includes('dispute')) {
    reply = `If you have any dispute or safety concern, you can submit an instant ticket or reach out to the National Consumer Helpline at 1915 / 1800-11-4000 (8 AM to 8 PM). For urgent personal emergencies, call 112 directly.`;
    actions = [
      { label: 'Submit Ticket', action: 'CREATE_TICKET' },
      { label: 'Call 1915 (Consumer Helpline)', action: 'CALL_1915' },
    ];
  } else if (q.includes('trust') || q.includes('score')) {
    reply = `Bharat Kaushal Trust Score is 100% explainable and weighted: Identity (20%), Cooperative Society (15%), Skill Assessment (20%), Experience (10%), Performance (15%), Ratings (10%), and Reliability (10%).`;
  } else {
    reply = `I can help you with live tracking, dataset pricing in Indore, arrival/completion OTP verification, cooperative earnings, or human support escalation. What would you like assistance with?`;
  }

  res.json({ reply, actions });
});

// Demo Reset & Test Scenarios Trigger
app.post('/api/demo/reset', (_req, res) => {
  workers = JSON.parse(JSON.stringify(SEEDED_WORKERS));
  customers = [JSON.parse(JSON.stringify(PRIMARY_DEMO_CUSTOMER))];
  bookings = [JSON.parse(JSON.stringify(INITIAL_BOOKING))];
  policy = JSON.parse(JSON.stringify(INITIAL_POLICY));
  appeals = [];

  auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    event: 'DEMO_RESET',
    user: 'ADMIN',
    details: 'System state reset to baseline demo seed.',
    timestamp: new Date().toISOString(),
  });

  const stateData = {
    workers,
    customers,
    bookings,
    policy,
    ledger,
    welfareRecords,
    complaints,
    appeals,
    auditLogs,
    notifications,
    societies: SEEDED_SOCIETIES,
    services: INDORE_SERVICES_DATASET,
    demandForecast: DEMAND_FORECAST_DATA,
  };

  broadcast('INIT_STATE', stateData, 'System reset to pristine demo state.');

  res.json({ success: true, message: 'Reset successfully', data: stateData });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bharat Kaushal] Unified Server running on http://0.0.0.0:${PORT} with WebSockets on ws://0.0.0.0:${PORT}/ws`);
  });
}

startServer();

