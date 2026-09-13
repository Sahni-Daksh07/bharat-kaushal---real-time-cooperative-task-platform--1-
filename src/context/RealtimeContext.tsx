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

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
}

export type ConnectionState = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

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
    preselectedWorkerId?: string
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
    preselectedWorkerId?: string
  ): Promise<Booking> => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId,
        customerId: currentCustomer.id,
        customerName: currentCustomer.name,
        customerPhone: currentCustomer.phone,
        customerAddress: address || currentCustomer.addresses[0],
        scopeDetails,
        preselectedWorkerId,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      const customErr: any = new Error(err.error || 'Failed to create booking');
      customErr.data = err;
      throw customErr;
    }
    return res.json();
  };

  const updateService = async (serviceId: string, data: Partial<ServiceItem>): Promise<ServiceItem> => {
    const res = await fetch(`/api/services/${serviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update service');
    const updated = await res.json();
    setServices((prev) => prev.map((s) => (s.record_id === serviceId ? updated : s)));
    return updated;
  };

  const acceptBooking = async (bookingId: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/accept`, { method: 'POST' });
    return res.json();
  };

  const startJourney = async (bookingId: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/start-journey`, { method: 'POST' });
    return res.json();
  };

  const simulateWorkerStep = async (bookingId: string): Promise<void> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.workerLocation) return;
    const newDistance = Math.max(0.1, Math.round((booking.workerLocation.distanceKm - 0.4) * 10) / 10);
    const newEta = Math.max(1, Math.round(newDistance * 3.5));
    await fetch(`/api/bookings/${bookingId}/update-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distanceKm: newDistance,
        etaMinutes: newEta,
      }),
    });
  };

  const workerArrived = async (bookingId: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/arrived`, { method: 'POST' });
    return res.json();
  };

  const verifyArrivalOtp = async (bookingId: string, otp: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/verify-arrival-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid OTP');
    }
    return res.json();
  };

  const requestMaterialCharge = async (bookingId: string, name: string, amount: number): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/request-material`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount }),
    });
    return res.json();
  };

  const respondMaterialCharge = async (bookingId: string, materialId: string, approved: boolean): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/respond-material`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materialId, approved }),
    });
    return res.json();
  };

  const completeJob = async (bookingId: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/complete`, { method: 'POST' });
    return res.json();
  };

  const verifyCompletionOtp = async (bookingId: string, otp: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/verify-completion-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid OTP');
    }
    return res.json();
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
    const res = await fetch(`/api/bookings/${bookingId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment reconciliation failed');
    }
    const updated = await res.json();
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    return updated;
  };

  const rateWorker = async (bookingId: string, stars: number, feedback?: string): Promise<Booking> => {
    const res = await fetch(`/api/bookings/${bookingId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars, feedback }),
    });
    return res.json();
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
