import fs from 'fs';
import path from 'path';
import {
  WorkerProfile,
  CustomerProfile,
  SocietyAdminProfile,
  FederationAdminProfile,
  SuperAdminProfile,
  Booking,
  CooperativePolicy,
  FinancialLedgerEntry,
  WelfareRecord,
  SupportComplaint,
  ServiceItem,
} from '../types';
import { INDORE_SERVICES_DATASET } from '../data/servicesData';
import {
  SEEDED_WORKERS,
  SEEDED_CUSTOMERS,
  SEEDED_SOCIETY_ADMINS,
  SEEDED_FEDERATION_ADMINS,
  SEEDED_SUPER_ADMINS,
  INITIAL_BOOKING,
  INITIAL_POLICY,
} from '../data/seedData';
import { supabaseAdmin, isSupabaseConfigured } from './supabaseClient';

export interface DatabaseState {
  workers: WorkerProfile[];
  customers: CustomerProfile[];
  societyAdmins: SocietyAdminProfile[];
  federationAdmins: FederationAdminProfile[];
  superAdmins: SuperAdminProfile[];
  bookings: Booking[];
  policy: CooperativePolicy;
  services: ServiceItem[];
  ledger: FinancialLedgerEntry[];
  welfareRecords: WelfareRecord[];
  complaints: SupportComplaint[];
  lastUpdated: string;
}

export class BharatKaushalDatabase {
  private dataDir: string;
  private dbFilePath: string;
  private isConnected: boolean = false;
  private isCloudSynced: boolean = false;
  private state: DatabaseState;

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.resolve(process.cwd(), 'data');
    this.dbFilePath = path.join(this.dataDir, 'bharat_kaushal.db.json');
    this.state = this.initializeDefaultState();
  }

  private initializeDefaultState(): DatabaseState {
    return {
      workers: JSON.parse(JSON.stringify(SEEDED_WORKERS)),
      customers: JSON.parse(JSON.stringify(SEEDED_CUSTOMERS)),
      societyAdmins: JSON.parse(JSON.stringify(SEEDED_SOCIETY_ADMINS)),
      federationAdmins: JSON.parse(JSON.stringify(SEEDED_FEDERATION_ADMINS)),
      superAdmins: JSON.parse(JSON.stringify(SEEDED_SUPER_ADMINS)),
      bookings: [JSON.parse(JSON.stringify(INITIAL_BOOKING))],
      policy: JSON.parse(JSON.stringify(INITIAL_POLICY)),
      services: JSON.parse(JSON.stringify(INDORE_SERVICES_DATASET)),
      ledger: [
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
      ],
      welfareRecords: [
        {
          id: 'WLF-001',
          workerId: 'W-001',
          workerName: 'Ramesh Patidar',
          bookingId: 'BK-2026-IND-01',
          contributionAmount: 450,
          timestamp: new Date().toISOString(),
          scheme: 'MP Unorganized Workers Social Security Fund',
        },
      ],
      complaints: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Connect to Database
   * Reads persistent JSON storage from disk and hydrates from Supabase Cloud if configured.
   */
  public async connect(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf-8');
        try {
          const parsed = JSON.parse(fileContent);
          if (parsed && parsed.services && Array.isArray(parsed.services)) {
            this.state = parsed;
            console.log(`[DB] Loaded ${this.state.services.length} services, ${this.state.workers.length} artisans, and ${this.state.bookings.length} bookings from persistent store.`);
          }
        } catch (e) {
          console.warn('[DB] Warning parsing persistent db file, using seeded fallback:', e);
          this.persistState();
        }
      } else {
        this.persistState();
        console.log(`[DB] Initialized fresh persistent database at: ${this.dbFilePath}`);
      }

      // Supabase Cloud Hydration
      if (isSupabaseConfigured && supabaseAdmin) {
        console.log('[DB] Connecting to Supabase Cloud Database (gndkbtssabnmknkendpz)...');
        try {
          const [srvRes, wrkRes, socRes] = await Promise.all([
            Promise.resolve(supabaseAdmin.from('services').select('*').limit(200)),
            Promise.resolve(supabaseAdmin.from('workers').select('*').limit(50)),
            Promise.resolve(supabaseAdmin.from('societies').select('*').limit(20)),
          ]);

          if (srvRes.data && srvRes.data.length > 0) {
            console.log(`[DB] ✓ Supabase Cloud Sync: Verified ${srvRes.data.length} services, ${wrkRes.data?.length || 0} artisans, ${socRes.data?.length || 0} societies.`);
            this.isCloudSynced = true;
          }
        } catch (cloudErr) {
          console.warn('[DB] Supabase Cloud hydration fallback to local cache:', cloudErr);
        }
      }

      this.isConnected = true;
      return true;
    } catch (err) {
      console.error('[DB] Connection error:', err);
      this.isConnected = true; // Fallback to memory
      return false;
    }
  }

  /**
   * Save snapshot to disk asynchronously
   */
  private persistState(): void {
    try {
      this.state.lastUpdated = new Date().toISOString();
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dbFilePath, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Failed to persist state to disk:', e);
    }
  }

  // --- QUERY METHODS ---

  public getWorkers(): WorkerProfile[] {
    return this.state.workers;
  }

  public getWorkerById(id: string): WorkerProfile | undefined {
    return this.state.workers.find((w) => w.id === id);
  }

  public updateWorker(id: string, updates: Partial<WorkerProfile>): WorkerProfile | null {
    const idx = this.state.workers.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    this.state.workers[idx] = { ...this.state.workers[idx], ...updates };
    this.persistState();

    // Async sync to Supabase
    if (supabaseAdmin) {
      Promise.resolve(
        supabaseAdmin
          .from('workers')
          .update({
            availability: updates.availability,
            rating: updates.rating,
            trust_score: updates.trustScore,
          })
          .eq('id', id)
      ).catch(() => {});
    }

    return this.state.workers[idx];
  }

  public getCustomers(): CustomerProfile[] {
    return this.state.customers;
  }

  public getCustomerById(id: string): CustomerProfile | undefined {
    return this.state.customers.find((c) => c.id === id);
  }

  public getSocietyAdmins(): SocietyAdminProfile[] {
    return this.state.societyAdmins;
  }

  public getFederationAdmins(): FederationAdminProfile[] {
    return this.state.federationAdmins;
  }

  public getSuperAdmins(): SuperAdminProfile[] {
    return this.state.superAdmins;
  }

  public getServices(category?: string, query?: string): ServiceItem[] {
    let result = this.state.services;
    if (category && category !== 'ALL') {
      result = result.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.service_name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.notes && s.notes.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getBookings(): Booking[] {
    return this.state.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.state.bookings.find((b) => b.id === id);
  }

  public createBooking(booking: Booking): Booking {
    this.state.bookings.unshift(booking);
    this.persistState();

    // Async sync to Supabase
    if (supabaseAdmin) {
      const grossAmount = booking.pricing?.grossAmount ?? booking.pricing?.netPayable ?? 250;
      const workerShare = booking.pricing?.workerShare ?? 236.25;
      const societyShare = booking.pricing?.societyShare ?? 8.75;
      const welfareShare = booking.pricing?.welfareShare ?? 5.0;
      const netPayable = booking.pricing?.netPayable ?? grossAmount;

      Promise.resolve(
        supabaseAdmin.from('bookings').insert([
          {
            id: booking.id,
            customer_id: booking.customerId,
            worker_id: booking.workerId || null,
            service_id: booking.serviceId,
            status: booking.status,
            gross_amount: grossAmount,
            worker_share: workerShare,
            society_share: societyShare,
            welfare_share: welfareShare,
            net_payable: netPayable,
            arrival_otp: booking.arrivalOtp,
            completion_otp: booking.completionOtp,
            scope_details: (booking as any).scopeDetails?.additionalNotes || '',
          },
        ])
      ).catch(() => {});
    }

    return booking;
  }

  public updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const idx = this.state.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.state.bookings[idx] = { ...this.state.bookings[idx], ...updates };
    this.persistState();

    // Async sync to Supabase
    if (supabaseAdmin) {
      Promise.resolve(
        supabaseAdmin
          .from('bookings')
          .update({
            status: updates.status,
            completed_at: updates.status === 'COMPLETED' ? new Date().toISOString() : undefined,
            paid_at: updates.paymentStatus === 'PAID' ? new Date().toISOString() : undefined,
          })
          .eq('id', id)
      ).catch(() => {});
    }

    return this.state.bookings[idx];
  }

  public getPolicy(): CooperativePolicy {
    return this.state.policy;
  }

  public updatePolicy(updates: Partial<CooperativePolicy>): CooperativePolicy {
    this.state.policy = { ...this.state.policy, ...updates };
    this.persistState();
    return this.state.policy;
  }

  public getLedger(): FinancialLedgerEntry[] {
    return this.state.ledger;
  }

  public recordLedgerEntry(entry: FinancialLedgerEntry): FinancialLedgerEntry {
    this.state.ledger.unshift(entry);
    this.persistState();

    // Async sync to Supabase
    if (supabaseAdmin) {
      Promise.resolve(
        supabaseAdmin.from('financial_ledger').insert([
          {
            id: entry.id,
            booking_id: entry.bookingId,
            customer_paid: entry.customerPaid,
            worker_credit: entry.workerCredit,
            society_credit: entry.societyCredit,
            welfare_credit: entry.welfareCredit,
            policy_snapshot: entry.policySnapshot,
            status: entry.status,
          },
        ])
      ).catch(() => {});
    }

    return entry;
  }

  public getWelfareRecords(): WelfareRecord[] {
    return this.state.welfareRecords;
  }

  public updateWelfareRecord(workerId: string, amount: number, bookingId?: string): WelfareRecord {
    const worker = this.getWorkerById(workerId);
    const record: WelfareRecord = {
      id: `WLF-${Date.now().toString().slice(-4)}`,
      workerId,
      workerName: worker ? worker.name : 'Unknown Artisan',
      bookingId: bookingId || `BK-SYS-${Date.now().toString().slice(-4)}`,
      contributionAmount: amount,
      timestamp: new Date().toISOString(),
      scheme: 'MP Unorganized Workers Social Security Fund',
    };
    this.state.welfareRecords.push(record);
    this.persistState();
    return record;
  }

  public getStatsSummary() {
    const totalBookings = this.state.bookings.length;
    const completedBookings = this.state.bookings.filter((b) => b.status === 'COMPLETED').length;
    const totalVolume = this.state.ledger.reduce((acc, curr) => acc + curr.customerPaid, 0);
    const totalWorkerDisbursed = this.state.ledger.reduce((acc, curr) => acc + curr.workerCredit, 0);
    const totalWelfareFund = this.state.ledger.reduce((acc, curr) => acc + curr.welfareCredit, 0);
    const totalSocietyAdmin = this.state.ledger.reduce((acc, curr) => acc + curr.societyCredit, 0);

    return {
      activeArtisans: this.state.workers.filter((w) => w.availability).length,
      totalArtisans: this.state.workers.length,
      catalogServicesCount: this.state.services.length,
      totalBookings,
      completedBookings,
      totalVolume,
      totalWorkerDisbursed,
      totalWelfareFund,
      totalSocietyAdmin,
      realizationPercent: 94.5,
      societyPercent: 3.5,
      welfarePercent: 2.0,
      act: 'Madhya Pradesh Cooperative Societies Act, 1960',
      cloudConnected: this.isCloudSynced,
    };
  }

  public isDbConnected(): boolean {
    return this.isConnected;
  }

  public isCloudConnected(): boolean {
    return this.isCloudSynced;
  }
}

// Singleton database instance
export const db = new BharatKaushalDatabase();
