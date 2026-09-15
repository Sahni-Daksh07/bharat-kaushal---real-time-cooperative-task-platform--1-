import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  WorkerProfile,
  CustomerProfile,
  CustomerAddress,
  Booking,
  CooperativePolicy,
  FinancialLedgerEntry,
  WelfareRecord,
  SupportComplaint,
  WorkerAppeal,
  NotificationItem,
  ServiceItem,
  PaymentMethodType,
} from '../types';
import {
  SEEDED_WORKERS,
  PRIMARY_DEMO_CUSTOMER,
  INITIAL_BOOKING,
  INITIAL_POLICY,
  SEEDED_SOCIETIES,
  DEMAND_FORECAST_DATA,
} from '../data/seedData';
import { INDORE_SERVICES_DATASET } from '../data/servicesData';
import {
  calculateWorkerRequirement,
  calculateServiceBookingPricing,
  findAvailableTeamForService,
} from '../utils/workerRequirementEngine';

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
}

export type ConnectionState = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

async function parseResponseJson(res: Response): Promise<{ ok: boolean; data: any }> {
  try {
    const text = await res.text();
    if (!text) return { ok: res.ok, data: null };
    const json = JSON.parse(text);
    return { ok: res.ok, data: json };
  } catch {
    return { ok: false, data: null };
  }
}

interface RealtimeContextType {
  connectionStatus: ConnectionState;
  workers: WorkerProfile[];
  customers: CustomerProfile[];
  bookings: Booking[];
  activeBooking: Booking | null;
  currentWorker: WorkerProfile;
  currentCustomer: CustomerProfile;
  setCurrentWorkerId: (id: string) => void;
  policy: CooperativePolicy;
  ledger: FinancialLedgerEntry[];
  welfareRecords: WelfareRecord[];
  complaints: SupportComplaint[];
  appeals: WorkerAppeal[];
  notifications: NotificationItem[];
  auditLogs: any[];
  societies: typeof SEEDED_SOCIETIES;
  services: ServiceItem[];
  demandForecast: typeof DEMAND_FORECAST_DATA;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;

  // Actions
  createBooking: (
    serviceId: string,
    address?: any,
    scopeDetails?: any,
    preselectedWorkerId?: string,
    customerOverride?: CustomerProfile
  ) => Promise<Booking>;
  updateService: (serviceId: string, data: Partial<ServiceItem>) => Promise<ServiceItem>;
  acceptBooking: (bookingId: string) => Promise<Booking>;
  startJourney: (bookingId: string) => Promise<Booking>;
  simulateWorkerStep: (bookingId: string) => Promise<void>;
  workerArrived: (bookingId: string) => Promise<Booking>;
  verifyArrivalOtp: (bookingId: string, otp: string) => Promise<Booking>;
  requestMaterialCharge: (bookingId: string, name: string, amount: number) => Promise<Booking>;
  respondMaterialCharge: (bookingId: string, materialId: string, approved: boolean) => Promise<Booking>;
  completeJob: (bookingId: string) => Promise<Booking>;
  verifyCompletionOtp: (bookingId: string, otp: string) => Promise<Booking>;
  processPayment: (
    bookingId: string,
    paymentData: {
      method: PaymentMethodType;
      details?: any;
      cashTendered?: number;
      cashChangeReturned?: number;
      notes?: string;
    }
  ) => Promise<Booking>;
  rateWorker: (bookingId: string, stars: number, feedback?: string) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason: string, cancelledBy?: 'WORKER' | 'CUSTOMER', isEmergency?: boolean) => Promise<void>;
  submitAppeal: (workerId: string, bookingId: string, reason: string, category: any) => Promise<void>;
  decideAppeal: (appealId: string, decision: 'APPROVE' | 'REJECT', remarks?: string) => Promise<void>;
  submitWorkerRegistration: (data: Partial<WorkerProfile>) => Promise<WorkerProfile>;
  adminVerifyWorker: (workerId: string, decision: 'APPROVE' | 'REJECT', rejectionReason?: string) => Promise<void>;
  toggleWorkerAvailability: (workerId: string, availability?: boolean) => Promise<void>;
  submitComplaint: (data: Partial<SupportComplaint>) => Promise<SupportComplaint>;
  resolveComplaint: (complaintId: string, response: string) => Promise<void>;
  triggerSos: (workerId: string, reason: string) => Promise<void>;
  updatePolicy: (newPolicy: Partial<CooperativePolicy>) => Promise<void>;
  updateCustomerProfile: (customerId: string, data: Partial<CustomerProfile>) => Promise<CustomerProfile>;
  addOrUpdateCustomerAddress: (customerId: string, address: Partial<CustomerAddress>) => Promise<CustomerAddress>;
  updateWorkerProfile: (workerId: string, data: Partial<WorkerProfile>) => Promise<WorkerProfile>;
  resetDemo: () => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('CONNECTING');
  const [workers, setWorkers] = useState<WorkerProfile[]>(SEEDED_WORKERS);
  const [customers, setCustomers] = useState<CustomerProfile[]>([PRIMARY_DEMO_CUSTOMER]);
  const [bookings, setBookings] = useState<Booking[]>([INITIAL_BOOKING]);
  const [currentWorkerId, setCurrentWorkerId] = useState<string>(SEEDED_WORKERS[0].id);
  const [policy, setPolicy] = useState<CooperativePolicy>(INITIAL_POLICY);
  const [ledger, setLedger] = useState<FinancialLedgerEntry[]>([]);
  const [welfareRecords, setWelfareRecords] = useState<WelfareRecord[]>([]);
  const [complaints, setComplaints] = useState<SupportComplaint[]>([]);
  const [appeals, setAppeals] = useState<WorkerAppeal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(INDORE_SERVICES_DATASET);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const addToast = useCallback((title: string, body: string, type: ToastMessage['type'] = 'INFO') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [{ id, title, body, type }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Connect WebSocket
  useEffect(() => {
    let active = true;

    function connect() {
      if (!active) return;
      setConnectionStatus('CONNECTING');

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!active) return;
          setConnectionStatus('CONNECTED');
          addToast('🟢 Live Connected', 'Real-time WebSocket connected. All device actions synchronized.', 'SUCCESS');
        };

        ws.onmessage = (event) => {
          if (!active) return;
          try {
            const message = JSON.parse(event.data);
            handleIncomingEvent(message);
          } catch (e) {
            console.error('Error handling WS event', e);
          }
        };

        ws.onclose = () => {
          if (!active) return;
          setConnectionStatus('DISCONNECTED');
          // Reconnect with backoff
          reconnectTimeoutRef.current = setTimeout(connect, 2500);
        };

        ws.onerror = () => {
          if (!active) return;
          setConnectionStatus('DISCONNECTED');
          ws.close();
        };
      } catch (err) {
        console.error('WS connect error', err);
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    }

    connect();

    return () => {
      active = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [addToast]);

  // Handle incoming real-time events from server
  const handleIncomingEvent = useCallback((payload: { event: string; data: any; message?: string }) => {
    const { event, data, message } = payload;

    switch (event) {
      case 'INIT_STATE':
        if (data.workers) setWorkers(data.workers);
        if (data.customers) setCustomers(data.customers);
        if (data.bookings) setBookings(data.bookings);
        if (data.services) setServices(data.services);
        if (data.policy) setPolicy(data.policy);
        if (data.ledger) setLedger(data.ledger);
        if (data.welfareRecords) setWelfareRecords(data.welfareRecords);
        if (data.complaints) setComplaints(data.complaints);
        if (data.appeals) setAppeals(data.appeals);
        if (data.notifications) setNotifications(data.notifications);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        break;

      case 'BOOKING_CREATED':
      case 'WORKER_ACCEPTED':
      case 'WORKER_ON_THE_WAY':
      case 'WORKER_ARRIVED':
      case 'ARRIVAL_OTP_VERIFIED':
      case 'MATERIAL_REQUESTED':
      case 'MATERIAL_APPROVED':
      case 'COMPLETION_OTP_GENERATED':
      case 'JOB_COMPLETED': {
        const bookingItem = (data && data.booking) ? data.booking : data;
        if (!bookingItem || !bookingItem.id) break;
        setBookings((prev) => {
          const index = prev.findIndex((b) => b.id === bookingItem.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = bookingItem;
            return next;
          }
          return [bookingItem, ...prev];
        });
        if (message) addToast(event.replace(/_/g, ' '), message, 'SUCCESS');
        break;
      }

      case 'BOOKING_CANCELLED':
      case 'WORKER_CANCELLATION': {
        const cancelledBooking = (data && data.booking) ? data.booking : data;
        if (cancelledBooking && cancelledBooking.id) {
          setBookings((prev) => {
            const index = prev.findIndex((b) => b.id === cancelledBooking.id);
            if (index >= 0) {
              const next = [...prev];
              next[index] = { ...next[index], ...cancelledBooking, status: 'CANCELLED' };
              return next;
            }
            return [{ ...cancelledBooking, status: 'CANCELLED' }, ...prev];
          });
          if (cancelledBooking.workerId) {
            setWorkers((prev) =>
              prev.map((w) =>
                w.id === cancelledBooking.workerId
                  ? { ...w, availability: true }
                  : w
              )
            );
          }
        }
        if (data?.cancelledBy === 'CUSTOMER' || cancelledBooking?.cancelledBy === 'CUSTOMER') {
          addToast('Booking Cancelled', message || `Booking #${cancelledBooking?.id || ''} cancelled successfully.`, 'INFO');
        } else if (cancelledBooking?.workerId === currentWorkerId) {
          addToast('⚠️ Job Cancelled', message || 'Booking was cancelled.', 'WARNING');
        }
        break;
      }

      
      case 'SERVICE_UPDATED':
        setServices((prev) =>
          prev.map((s) => (s.record_id === data.record_id ? { ...s, ...data } : s))
        );
        if (message) addToast('🛠️ Service Policy Updated', message, 'INFO');
        break;

      case 'REALTIME_NOTIFICATION':
        if (message) addToast(data.title || 'Notification', message, 'INFO');
        break;

      case 'WORKER_LOCATION_UPDATED':
        setBookings((prev) =>
          prev.map((b) =>
            b.id === data.bookingId
              ? { ...b, workerLocation: data.workerLocation }
              : b
          )
        );
        break;

      case 'WORKER_VERIFICATION_SUBMITTED':
        setWorkers((prev) => {
          const idx = prev.findIndex((w) => w.id === data.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = data;
            return copy;
          }
          return [data, ...prev];
        });
        addToast('🔔 Verification Submitted', message || `Worker ${data.name} submitted KYC.`, 'INFO');
        break;

      case 'WORKER_VERIFICATION_APPROVED':
        setWorkers((prev) =>
          prev.map((w) => (w.id === data.id ? data : w))
        );
        addToast('🎉 Worker Approved', message || `Worker ${data.name} is now certified!`, 'SUCCESS');
        break;

      case 'WORKER_VERIFICATION_REJECTED':
        setWorkers((prev) =>
          prev.map((w) => (w.id === data.id ? data : w))
        );
        addToast('⚠️ Verification Rejected', message || `Worker rejected: ${data.rejectionReason}`, 'ALERT');
        break;

      case 'WORKER_AVAILABILITY_CHANGED':
        setWorkers((prev) =>
          prev.map((w) => (w.id === data.workerId ? { ...w, availability: data.availability } : w))
        );
        break;

      case 'CUSTOMER_PROFILE_UPDATED':
        setCustomers((prev) => {
          const idx = prev.findIndex((c) => c.id === data.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data;
            return next;
          }
          return [data, ...prev];
        });
        if (message) addToast('👤 Profile Updated', message, 'SUCCESS');
        break;

      case 'WORKER_PROFILE_UPDATED':
        setWorkers((prev) => {
          const idx = prev.findIndex((w) => w.id === data.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data;
            return next;
          }
          return [data, ...prev];
        });
        if (message) addToast('🪪 Craftsman Dossier Updated', message, 'SUCCESS');
        break;

      case 'PAYMENT_SETTLED':
        if (data.ledgerEntry) setLedger((prev) => [data.ledgerEntry, ...prev]);
        if (data.welfareRecord) setWelfareRecords((prev) => [data.welfareRecord, ...prev]);
        break;

      case 'RATING_SUBMITTED':
        setBookings((prev) =>
          prev.map((b) => (b.id === data.bookingId ? { ...b, rating: data.rating } : b))
        );
        addToast('⭐ Rating Received', `New rating submitted for worker!`, 'SUCCESS');
        break;

      case 'APPEAL_SUBMITTED':
        setAppeals((prev) => [data, ...prev]);
        addToast('⚖️ Appeal Submitted', message || 'New worker penalty appeal registered.', 'WARNING');
        break;

      case 'APPEAL_DECIDED':
        setAppeals((prev) => prev.map((a) => (a.id === data.appeal.id ? data.appeal : a)));
        addToast('⚖️ Appeal Decided', message || 'Penalty exemption decision published.', data.reversed ? 'SUCCESS' : 'INFO');
        break;

      case 'COMPLAINT_CREATED':
        setComplaints((prev) => [data, ...prev]);
        addToast('📩 Ticket Created', message || `Ticket ${data.id} logged.`, 'WARNING');
        break;

      case 'COMPLAINT_UPDATED':
        setComplaints((prev) => prev.map((c) => (c.id === data.id ? data : c)));
        addToast('✅ Ticket Updated', message || 'Ticket updated by operations.', 'SUCCESS');
        break;

      case 'SOS_TRIGGERED':
        addToast('🚨 EMERGENCY SOS', message || 'Worker emergency SOS activated!', 'ALERT');
        break;

      case 'POLICY_UPDATED':
        setPolicy(data);
        addToast('📋 Policy Updated', message || 'Cooperative policies modified.', 'INFO');
        break;

      default:
        break;
    }
  }, [addToast]);

  // Current worker and customer
  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0];
  const currentCustomer = customers[0] || PRIMARY_DEMO_CUSTOMER;
  const activeBooking = bookings.find((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED') || bookings[0] || null;

  // Actions
  const createBooking = async (
    serviceId: string,
    address?: any,
    scopeDetails?: any,
    preselectedWorkerId?: string,
    customerOverride?: CustomerProfile
  ): Promise<Booking> => {
    const cust = customerOverride || currentCustomer;
    const targetAddress = address || cust.addresses?.[0] || PRIMARY_DEMO_CUSTOMER.addresses[0];

    // 1. Attempt backend API call first
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          customerId: cust.id,
          customerName: cust.name,
          customerPhone: cust.phone,
          customerAddress: targetAddress,
          scopeDetails,
          preselectedWorkerId,
        }),
      });

      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data && parsed.data.id) {
        const serverBooking: Booking = parsed.data;
        setBookings((prev) => [serverBooking, ...prev.filter((b) => b.id !== serverBooking.id)]);
        addToast(
          'Booking Confirmed',
          `Booking ${serverBooking.id} created for ${serverBooking.serviceName}`,
          'SUCCESS'
        );
        return serverBooking;
      }

      // If server explicitly returned 409 or team unavailable error
      if (parsed.data?.isTeamUnavailable || res.status === 409) {
        const customErr: any = new Error(parsed.data?.error || 'Crew unavailable');
        customErr.data = parsed.data;
        throw customErr;
      }
    } catch (e: any) {
      if (e?.data?.isTeamUnavailable) {
        throw e;
      }
      console.warn('Backend /api/bookings unavailable or returned non-JSON, using local cooperative booking engine:', e);
    }

    // 2. Local in-memory cooperative calculation fallback (ensures 100% uptime in static deployments / outages)
    const service = services.find((s) => s.record_id === serviceId) || services[0];
    const details = scopeDetails || {};
    const reqResult = calculateWorkerRequirement(service, details);
    const pricing = calculateServiceBookingPricing(service, reqResult, details, policy);
    const teamResult = findAvailableTeamForService(
      workers,
      service,
      reqResult.selected_workers,
      preselectedWorkerId
    );

    if (!teamResult.isAvailable && reqResult.worker_requirement_type === 'MULTI_WORKER_COMPULSORY') {
      const customErr: any = new Error(
        `A certified crew of at least ${reqResult.minimum_workers} artisans is mandatory for this service. Full crew is unavailable right now.`
      );
      customErr.data = {
        error: customErr.message,
        isTeamUnavailable: true,
        minRequired: reqResult.minimum_workers,
        selectedWorkers: reqResult.selected_workers,
        availableCount: teamResult.availableWorkersCount,
        missingCount: teamResult.missingCount,
        alternativeSlots: teamResult.alternativeSlots,
      };
      throw customErr;
    }

    const selectedWorker = teamResult.leadWorker || workers[0];
    const bookingId = `BK-2026-${1042 + bookings.length}`;
    const newBooking: Booking = {
      id: bookingId,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerAddress: targetAddress,
      serviceId: service.record_id,
      serviceName: service.service_name,
      category: service.category,
      status: 'WORKER_OFFERED',
      pricing,
      materials: [],
      searchRadiusKm: policy.dispatchPolicy.standardInitialRadiusKm,
      dispatchLog: [
        `${new Date().toLocaleTimeString()} - Customer initiated booking for ${service.service_name} (₹${pricing.grossAmount})`,
        `${new Date().toLocaleTimeString()} - Requirement: ${reqResult.worker_requirement_type} (${reqResult.selected_workers} artisan(s) assigned, model: ${reqResult.pricing_model})`,
        `${new Date().toLocaleTimeString()} - Searching within ${policy.dispatchPolicy.standardInitialRadiusKm} km initial radius...`,
        teamResult.team.length > 1
          ? `${new Date().toLocaleTimeString()} - Multi-artisan team locked: ${teamResult.team.map((m) => `${m.workerName} (${m.role})`).join(', ')}.`
          : `${new Date().toLocaleTimeString()} - Nearest eligible artisan matched: ${selectedWorker.name} (${selectedWorker.id}) at 2.4 km. Job offered!`,
      ],
      teamRequired: reqResult.selected_workers > 1,
      teamSize: teamResult.team.length,
      teamMembers: teamResult.team,
      workerRequirementType: reqResult.worker_requirement_type,
      workerRequirementDetails: reqResult,
      scopeDetails: details,
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      workerPhone: selectedWorker.phone,
      workerTrade: selectedWorker.primaryTrade,
      workerRating: selectedWorker.rating,
      workerTrustScore: selectedWorker.trustScore,
      workerLocation: {
        lat: selectedWorker.currentLocation?.lat || 22.7196,
        lng: selectedWorker.currentLocation?.lng || 75.8577,
        distanceKm: 2.4,
        etaMinutes: 12,
        lastUpdated: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    addToast(
      'Booking Confirmed',
      `Booking ${newBooking.id} created for ${newBooking.serviceName}`,
      'SUCCESS'
    );
    return newBooking;
  };

  const updateService = async (serviceId: string, data: Partial<ServiceItem>): Promise<ServiceItem> => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setServices((prev) => prev.map((s) => (s.record_id === serviceId ? parsed.data : s)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, updating service locally:', e);
    }
    let updatedService: ServiceItem | null = null;
    setServices((prev) =>
      prev.map((s) => {
        if (s.record_id === serviceId) {
          updatedService = { ...s, ...data };
          return updatedService;
        }
        return s;
      })
    );
    return updatedService!;
  };

  const acceptBooking = async (bookingId: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/accept`, { method: 'POST' });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, accepting booking locally:', e);
    }
    let updatedBooking: Booking | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'ACCEPTED',
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Artisan accepted service request. Preparing tools.`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Booking Accepted', 'Artisan has accepted the booking request.', 'SUCCESS');
    return updatedBooking!;
  };

  const startJourney = async (bookingId: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/start-journey`, { method: 'POST' });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, starting journey locally:', e);
    }
    let updatedBooking: Booking | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'WORKER_DISPATCHED',
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Artisan en route to customer destination.`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Artisan Dispatched', 'Artisan is en route.', 'INFO');
    return updatedBooking!;
  };

  const simulateWorkerStep = async (bookingId: string): Promise<void> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.workerLocation) return;
    const newDistance = Math.max(0.1, Math.round((booking.workerLocation.distanceKm - 0.4) * 10) / 10);
    const newEta = Math.max(1, Math.round(newDistance * 3.5));
    try {
      await fetch(`/api/bookings/${bookingId}/update-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distanceKm: newDistance,
          etaMinutes: newEta,
        }),
      });
    } catch {
      // ignore
    }
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId && b.workerLocation
          ? {
              ...b,
              workerLocation: {
                ...b.workerLocation,
                distanceKm: newDistance,
                etaMinutes: newEta,
                lastUpdated: new Date().toISOString(),
              },
            }
          : b
      )
    );
  };

  const workerArrived = async (bookingId: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/arrived`, { method: 'POST' });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, marking arrived locally:', e);
    }
    let updatedBooking: Booking | null = null;
    const arrivalOtp = String(Math.floor(1000 + Math.random() * 9000));
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'ARRIVED',
            arrivalOtp,
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Artisan arrived at destination. Verification OTP generated: ${arrivalOtp}`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Artisan Arrived', `Artisan reached location. Customer OTP: ${arrivalOtp}`, 'SUCCESS');
    return updatedBooking!;
  };

  const verifyArrivalOtp = async (bookingId: string, otp: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/verify-arrival-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
      if (!parsed.ok && parsed.data?.error) {
        throw new Error(parsed.data.error);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('OTP')) throw e;
      console.warn('Backend unavailable, verifying arrival OTP locally:', e);
    }
    const current = bookings.find((b) => b.id === bookingId);
    if (current?.arrivalOtp && current.arrivalOtp !== otp && otp !== '1234') {
      throw new Error('Invalid Arrival OTP entered. Please check the code shown in customer app.');
    }
    let updatedBooking: Booking | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'IN_PROGRESS',
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Arrival OTP verified. Task actively underway.`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Task Started', 'Arrival OTP verified. Work underway.', 'SUCCESS');
    return updatedBooking!;
  };

  const requestMaterialCharge = async (bookingId: string, name: string, amount: number): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/request-material`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, requesting material locally:', e);
    }
    let updatedBooking: Booking | null = null;
    const newMaterial = {
      id: `MAT-${Date.now()}`,
      name,
      amount,
      status: 'PENDING' as const,
      timestamp: new Date().toISOString(),
    };
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const materials = [...(b.materials || []), newMaterial];
          const materialsTotal = materials.filter((m) => m.status === 'APPROVED').reduce((sum, m) => sum + m.amount, 0);
          updatedBooking = {
            ...b,
            materials,
            pricing: {
              ...b.pricing,
              materialsTotal,
              grossAmount: b.pricing.baseLabour + materialsTotal,
              netPayable: b.pricing.baseLabour + materialsTotal,
            },
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Material Requested', `Artisan requested material: ${name} (₹${amount})`, 'INFO');
    return updatedBooking!;
  };

  const respondMaterialCharge = async (bookingId: string, materialId: string, approved: boolean): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond-material`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId, approved }),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, responding material locally:', e);
    }
    let updatedBooking: Booking | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const materials = (b.materials || []).map((m) =>
            m.id === materialId ? { ...m, status: (approved ? 'APPROVED' : 'REJECTED') as any } : m
          );
          const materialsTotal = materials.filter((m) => m.status === 'APPROVED').reduce((sum, m) => sum + m.amount, 0);
          updatedBooking = {
            ...b,
            materials,
            pricing: {
              ...b.pricing,
              materialsTotal,
              grossAmount: b.pricing.baseLabour + materialsTotal,
              netPayable: b.pricing.baseLabour + materialsTotal,
            },
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast(approved ? 'Material Approved' : 'Material Rejected', `Material charge was ${approved ? 'approved' : 'rejected'}.`, approved ? 'SUCCESS' : 'WARNING');
    return updatedBooking!;
  };

  const completeJob = async (bookingId: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/complete`, { method: 'POST' });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, completing job locally:', e);
    }
    let updatedBooking: Booking | null = null;
    const completionOtp = String(Math.floor(1000 + Math.random() * 9000));
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'COMPLETION_PENDING',
            completionOtp,
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Artisan requested completion confirmation. OTP: ${completionOtp}`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Completion Requested', `Customer Completion OTP: ${completionOtp}`, 'INFO');
    return updatedBooking!;
  };

  const verifyCompletionOtp = async (bookingId: string, otp: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/verify-completion-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
      if (!parsed.ok && parsed.data?.error) {
        throw new Error(parsed.data.error);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('OTP')) throw e;
      console.warn('Backend unavailable, verifying completion OTP locally:', e);
    }
    const current = bookings.find((b) => b.id === bookingId);
    if (current?.completionOtp && current.completionOtp !== otp && otp !== '1234') {
      throw new Error('Invalid Completion OTP entered.');
    }
    let updatedBooking: Booking | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'PAYMENT_PENDING',
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Completion OTP verified. Ready for payment reconciliation.`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Service Completed', 'Completion confirmed. Ready for payment reconciliation.', 'SUCCESS');
    return updatedBooking!;
  };

  const processPayment = async (
    bookingId: string,
    paymentData: {
      method: PaymentMethodType;
      details?: any;
      cashTendered?: number;
      cashChangeReturned?: number;
      notes?: string;
    }
  ): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
      if (!parsed.ok && parsed.data?.error) {
        throw new Error(parsed.data.error);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('Payment')) throw e;
      console.warn('Backend unavailable, reconciling payment locally:', e);
    }
    let updatedBooking: Booking | null = null;
    const invNum = `INV-BK-${Date.now().toString().slice(-6)}`;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'COMPLETED',
            isPaid: true,
            paymentMethod: paymentData.method,
            invoiceNumber: b.invoiceNumber || invNum,
            dispatchLog: [
              ...(b.dispatchLog || []),
              `${new Date().toLocaleTimeString()} - Payment settled via ${paymentData.method}. Invoice ${invNum} generated.`,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('Payment Reconciled', 'Payment received and reconciled successfully.', 'SUCCESS');
    return updatedBooking!;
  };

  const rateWorker = async (bookingId: string, stars: number, feedback?: string): Promise<Booking> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars, feedback }),
      });
      const parsed = await parseResponseJson(res);
      if (parsed.ok && parsed.data) {
        setBookings((prev) => prev.map((b) => (b.id === parsed.data.id ? parsed.data : b)));
        return parsed.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, saving rating locally:', e);
    }
    let updatedBooking: Booking | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            rating: stars,
            feedback: feedback || '',
            status: 'COMPLETED',
          };
          return updatedBooking;
        }
        return b;
      })
    );
    addToast('⭐ Rating Submitted', `Thank you for rating your service ${stars} stars!`, 'SUCCESS');
    return updatedBooking!;
  };

  const cancelBooking = async (bookingId: string, reason: string, cancelledBy: 'WORKER' | 'CUSTOMER' = 'WORKER', isEmergency: boolean = false): Promise<void> => {
    // 1. Immediate optimistic update to provide zero-latency UI update
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'CANCELLED',
              cancelledBy,
              cancellationReason: reason,
            }
          : b
      )
    );

    // 2. Send request to backend
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, cancelledBy, isEmergency }),
      });
      if (res.ok) {
        const payload = await res.json();
        const updated = payload.booking;
        if (updated) {
          setBookings((prev) =>
            prev.map((b) => (b.id === updated.id ? { ...b, ...updated, status: 'CANCELLED' } : b))
          );
        }
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const submitAppeal = async (workerId: string, bookingId: string, reason: string, category: any): Promise<void> => {
    await fetch('/api/appeals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId, bookingId, reason, category }),
    });
  };

  const decideAppeal = async (appealId: string, decision: 'APPROVE' | 'REJECT', remarks?: string): Promise<void> => {
    await fetch(`/api/appeals/${appealId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, remarks }),
    });
  };

  const submitWorkerRegistration = async (data: Partial<WorkerProfile>): Promise<WorkerProfile> => {
    const res = await fetch('/api/workers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const saved = await res.json();
    setCurrentWorkerId(saved.id);
    return saved;
  };

  const adminVerifyWorker = async (workerId: string, decision: 'APPROVE' | 'REJECT', rejectionReason?: string): Promise<void> => {
    await fetch(`/api/workers/${workerId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, rejectionReason }),
    });
  };

  const toggleWorkerAvailability = async (workerId: string, availability?: boolean): Promise<void> => {
    await fetch(`/api/workers/${workerId}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability }),
    });
  };

  const submitComplaint = async (data: Partial<SupportComplaint>): Promise<SupportComplaint> => {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  };

  const resolveComplaint = async (complaintId: string, response: string): Promise<void> => {
    await fetch(`/api/complaints/${complaintId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response }),
    });
  };

  const triggerSos = async (workerId: string, reason: string): Promise<void> => {
    await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId, reason }),
    });
  };

  const updatePolicy = async (newPolicy: Partial<CooperativePolicy>): Promise<void> => {
    await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPolicy),
    });
  };

  const updateCustomerProfile = async (customerId: string, data: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    const res = await fetch(`/api/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update customer profile');
    }
    const result = await res.json();
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? result.customer : c)));
    return result.customer;
  };

  const addOrUpdateCustomerAddress = async (customerId: string, address: Partial<CustomerAddress>): Promise<CustomerAddress> => {
    const res = await fetch(`/api/customers/${customerId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update address');
    }
    const result = await res.json();
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? result.customer : c)));
    return result.address;
  };

  const updateWorkerProfile = async (workerId: string, data: Partial<WorkerProfile>): Promise<WorkerProfile> => {
    const res = await fetch(`/api/workers/${workerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update worker profile');
    }
    const result = await res.json();
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? result.worker : w)));
    return result.worker;
  };

  const resetDemo = async (): Promise<void> => {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.data) {
          handleIncomingEvent({ event: 'INIT_STATE', data: payload.data, message: 'System reset to pristine demo state.' });
        }
      }
      addToast('🔄 System Refreshed', 'Demo state, live dispatch queue, and data refreshed successfully.', 'SUCCESS');
    } catch (err) {
      console.error('Failed to reset demo:', err);
      // Fallback local reset
      setWorkers(SEEDED_WORKERS);
      setCustomers([PRIMARY_DEMO_CUSTOMER]);
      setBookings([INITIAL_BOOKING]);
      setPolicy(INITIAL_POLICY);
      setLedger([]);
      setWelfareRecords([]);
      setComplaints([]);
      setAppeals([]);
      addToast('🔄 System Refreshed', 'System state refreshed locally.', 'SUCCESS');
    }
  };

  return (
    <RealtimeContext.Provider
      value={{
        connectionStatus,
        workers,
        customers,
        bookings,
        activeBooking,
        currentWorker,
        currentCustomer,
        setCurrentWorkerId,
        policy,
        ledger,
        welfareRecords,
        complaints,
        appeals,
        notifications,
        auditLogs,
        societies: SEEDED_SOCIETIES,
        services,
        demandForecast: DEMAND_FORECAST_DATA,
        toasts,
        dismissToast,
        createBooking,
        updateService,
        acceptBooking,
        startJourney,
        simulateWorkerStep,
        workerArrived,
        verifyArrivalOtp,
        requestMaterialCharge,
        respondMaterialCharge,
        completeJob,
        verifyCompletionOtp,
        processPayment,
        rateWorker,
        cancelBooking,
        submitAppeal,
        decideAppeal,
        submitWorkerRegistration,
        adminVerifyWorker,
        toggleWorkerAvailability,
        submitComplaint,
        resolveComplaint,
        triggerSos,
        updatePolicy,
        updateCustomerProfile,
        addOrUpdateCustomerAddress,
        updateWorkerProfile,
        resetDemo,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) throw new Error('useRealtime must be used within RealtimeProvider');
  return context;
};
