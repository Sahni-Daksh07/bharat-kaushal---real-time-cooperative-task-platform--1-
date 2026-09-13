import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WorkerProfile, Booking, ServiceItem } from '../../types';
import { useRealtime } from '../../context/RealtimeContext';
import { IdentityVerifiedBadge } from '../common/IdentityVerifiedBadge';
import { GeoapifyWorkerMap } from './GeoapifyWorkerMap';
import {
  MapPin,
  Navigation,
  Crosshair,
  ShieldCheck,
  Star,
  Clock,
  Compass,
  Filter,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  Briefcase,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  Wrench,
  Sparkles,
  Wind,
  Hammer,
  Radio,
  SlidersHorizontal,
  X,
  Info,
  ExternalLink,
} from 'lucide-react';

export type WorkerDisplayStatus = 'AVAILABLE' | 'BUSY' | 'OFF_DUTY' | 'UNDER_REVIEW';

export interface WorkerWithGeo extends WorkerProfile {
  distanceKm: number;
  etaMinutes: number;
  computedStatus: WorkerDisplayStatus;
  statusLabel: string;
  statusColor: string;
  activeBookingId?: string;
}

// Haversine formula to compute great-circle distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Urban Indore response speed: ~22 km/h + 3 min prep buffer
export function estimateEtaMinutes(distanceKm: number): number {
  const minutes = Math.round((distanceKm / 22) * 60) + 3;
  return Math.max(3, minutes);
}

// Icon helper by trade
function getTradeIcon(trade: string, size = 16) {
  const t = (trade || '').toLowerCase();
  if (t.includes('plumb')) return <Wrench size={size} />;
  if (t.includes('electr')) return <Zap size={size} />;
  if (t.includes('clean')) return <Sparkles size={size} />;
  if (t.includes('ac') || t.includes('appliance')) return <Wind size={size} />;
  if (t.includes('carp')) return <Hammer size={size} />;
  return <Briefcase size={size} />;
}

// Prominent landmarks in Indore for GIS cartographic reference
const INDORE_LANDMARKS = [
  { name: 'Rajwada Palace', lat: 22.7196, lng: 75.8577, category: 'Heritage' },
  { name: 'Palasia Square', lat: 22.7244, lng: 75.8839, category: 'Commercial' },
  { name: 'Vijay Nagar Sq', lat: 22.7533, lng: 75.8937, category: 'Hub' },
  { name: 'Navlakha Square', lat: 22.7051, lng: 75.8752, category: 'Transit' },
  { name: 'Bhanwarkuan Sq', lat: 22.6934, lng: 75.8665, category: 'Education' },
  { name: 'LIG Square', lat: 22.7356, lng: 75.8852, category: 'Residential' },
  { name: 'Khajrana Temple', lat: 22.7315, lng: 75.9124, category: 'Landmark' },
  { name: 'Chhappan Dukan', lat: 22.7218, lng: 75.8772, category: 'Food District' },
  { name: 'Collectorate', lat: 22.7121, lng: 75.8459, category: 'Govt Admin' },
  { name: 'Sudama Nagar', lat: 22.7025, lng: 75.8341, category: 'Residential' },
];

// Major transport arteries across Indore
const INDORE_ROADS = [
  // Ring Road (Approx arc)
  {
    name: 'Ring Road',
    points: [
      { lat: 22.755, lng: 75.895 },
      { lat: 22.74, lng: 75.91 },
      { lat: 22.71, lng: 75.9 },
      { lat: 22.69, lng: 75.88 },
      { lat: 22.685, lng: 75.85 },
      { lat: 22.695, lng: 75.82 },
      { lat: 22.72, lng: 75.81 },
      { lat: 22.75, lng: 75.83 },
    ],
  },
  // A.B. Road (Agra-Bombay arterial highway)
  {
    name: 'A.B. Road',
    points: [
      { lat: 22.68, lng: 75.85 },
      { lat: 22.705, lng: 75.875 },
      { lat: 22.724, lng: 75.884 },
      { lat: 22.74, lng: 75.89 },
      { lat: 22.76, lng: 75.895 },
      { lat: 22.78, lng: 75.905 },
    ],
  },
  // M.G. Road (City Central Spine)
  {
    name: 'M.G. Road',
    points: [
      { lat: 22.7196, lng: 75.84 },
      { lat: 22.7196, lng: 75.8577 },
      { lat: 22.722, lng: 75.875 },
      { lat: 22.7244, lng: 75.8839 },
    ],
  },
];

interface RealtimeWorkerMapViewProps {
  onSelectWorkerService?: (trade: string, worker?: WorkerProfile) => void;
  customerAddresses?: Array<{
    id: string;
    label: string;
    address: string;
    locality?: string;
    lat: number;
    lng: number;
  }>;
}

export const RealtimeWorkerMapView: React.FC<RealtimeWorkerMapViewProps> = ({
  onSelectWorkerService,
  customerAddresses,
}) => {
  const { workers, bookings, policy, currentCustomer } = useRealtime();

  // Geolocation & Map States
  const defaultHomeLat = customerAddresses?.[0]?.lat || 22.7051; // Navlakha Square
  const defaultHomeLng = customerAddresses?.[0]?.lng || 75.8752;

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    source: 'LIVE_GPS' | 'HOME_ADDRESS' | 'OFFICE_ADDRESS' | 'MAP_PIN';
    label: string;
    accuracy?: number;
  }>({
    lat: defaultHomeLat,
    lng: defaultHomeLng,
    source: 'HOME_ADDRESS',
    label: 'Home (Navlakha Square, Indore)',
  });

  const [geoPermissionStatus, setGeoPermissionStatus] = useState<
    'IDLE' | 'LOCATING' | 'SUCCESS' | 'DENIED' | 'UNSUPPORTED'
  >('IDLE');
  const [geoErrorMsg, setGeoErrorMsg] = useState<string | null>(null);

  // Map Filter & Viewport States
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'BUSY' | 'OFF_DUTY'>('ALL');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(policy.dispatchPolicy.standardInitialRadiusKm || 5);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [mapCenterOffset, setMapCenterOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRadiusZone, setShowRadiusZone] = useState(true);
  const [sortBy, setSortBy] = useState<'DISTANCE' | 'RATING' | 'TRUST'>('DISTANCE');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPLIT' | 'MAP_ONLY' | 'LIST_ONLY'>('SPLIT');
  const [mapEngine, setMapEngine] = useState<'GEOAPIFY' | 'GIS_RADAR'>('GEOAPIFY');

  const mapSvgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Request real device geolocation
  const handleRequestLiveLocation = () => {
    if (!navigator.geolocation) {
      setGeoPermissionStatus('UNSUPPORTED');
      setGeoErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setGeoPermissionStatus('LOCATING');
    setGeoErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // Check if device coordinates are near Indore (within ~150km)
        const distFromIndoreCenter = calculateDistanceKm(latitude, longitude, 22.7196, 75.8577);
        const isNearIndore = distFromIndoreCenter < 120;

        setUserLocation({
          lat: latitude,
          lng: longitude,
          source: 'LIVE_GPS',
          label: isNearIndore
            ? `Live GPS (Indore ±${Math.round(accuracy)}m)`
            : `Live Device GPS (Simulated / ±${Math.round(accuracy)}m)`,
          accuracy: Math.round(accuracy),
        });
        setGeoPermissionStatus('SUCCESS');
        setMapCenterOffset({ x: 0, y: 0 });
      },
      (error) => {
        setGeoPermissionStatus('DENIED');
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Defaulting to registered Indore service address.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location position unavailable. Using registered Indore address.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Using registered Indore address.';
        }
        setGeoErrorMsg(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Switch to customer's saved address
  const handleSelectSavedAddress = (addr: any) => {
    setUserLocation({
      lat: addr.lat,
      lng: addr.lng,
      source: addr.label === 'Home' ? 'HOME_ADDRESS' : 'OFFICE_ADDRESS',
      label: `${addr.label} (${addr.address || addr.locality || 'Indore'})`,
    });
    setMapCenterOffset({ x: 0, y: 0 });
  };

  // Map click to customize service location pin
  const handleMapSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen coordinates back to lat/lng
    const { minLat, maxLat, minLng, maxLng } = mapBoundingBox;
    const normX = (clickX - (rect.width / 2 + mapCenterOffset.x)) / (rect.width * zoomLevel) + 0.5;
    const normY = (clickY - (rect.height / 2 + mapCenterOffset.y)) / (rect.height * zoomLevel) + 0.5;

    if (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) {
      const clickedLng = minLng + normX * (maxLng - minLng);
      const clickedLat = maxLat - normY * (maxLat - minLat);

      setUserLocation({
        lat: Math.round(clickedLat * 10000) / 10000,
        lng: Math.round(clickedLng * 10000) / 10000,
        source: 'MAP_PIN',
        label: `Custom Service Pin (${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E)`,
      });
    }
  };

  // Compute status and distance for each worker in real time
  const enrichedWorkers: WorkerWithGeo[] = useMemo(() => {
    return workers.map((worker) => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        worker.currentLocation?.lat || 22.7196,
        worker.currentLocation?.lng || 75.8577
      );
      const eta = estimateEtaMinutes(dist);

      // Status resolution
      let computedStatus: WorkerDisplayStatus = 'AVAILABLE';
      let statusLabel = 'Available Now';
      let statusColor = '#10b981'; // Emerald

      if (worker.verificationStatus !== 'VERIFIED') {
        computedStatus = 'UNDER_REVIEW';
        statusLabel = 'Verification Review';
        statusColor = '#f59e0b'; // Amber
      } else if (!worker.availability) {
        computedStatus = 'OFF_DUTY';
        statusLabel = 'Off Duty';
        statusColor = '#94a3b8'; // Slate
      } else {
        // Check active jobs
        const activeJob = bookings.find(
          (b) =>
            b.workerId === worker.id &&
            !['COMPLETED', 'CANCELLED', 'DRAFT'].includes(b.status)
        );
        if (activeJob) {
          computedStatus = 'BUSY';
          statusLabel =
            activeJob.status === 'TRAVELLING' ? 'En Route to Job' : 'Active on Job';
          statusColor = '#3b82f6'; // Blue
        }
      }

      return {
        ...worker,
        distanceKm: dist,
        etaMinutes: eta,
        computedStatus,
        statusLabel,
        statusColor,
      };
    });
  }, [workers, bookings, userLocation]);

  // Unique trades for filter pills
  const availableTrades = useMemo(() => {
    const set = new Set<string>();
    workers.forEach((w) => {
      if (w.primaryTrade) set.add(w.primaryTrade);
    });
    return Array.from(set);
  }, [workers]);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return enrichedWorkers
      .filter((w) => {
        if (selectedTrade !== 'ALL' && w.primaryTrade !== selectedTrade) {
          return false;
        }
        if (statusFilter !== 'ALL' && w.computedStatus !== statusFilter) {
          return false;
        }
        if (w.distanceKm > maxRadiusKm) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'DISTANCE') return a.distanceKm - b.distanceKm;
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'TRUST') return b.trustScore - a.trustScore;
        return 0;
      });
  }, [enrichedWorkers, selectedTrade, statusFilter, maxRadiusKm, sortBy]);

  // Selected Worker profile
  const selectedWorker = useMemo(() => {
    return enrichedWorkers.find((w) => w.id === selectedWorkerId) || null;
  }, [enrichedWorkers, selectedWorkerId]);

  // Geographic Bounding Box for Indore Area
  // Center roughly at Rajwada / user location with dynamic expansion
  const mapBoundingBox = useMemo(() => {
    const centerLat = 22.72;
    const centerLng = 75.865;
    const latSpan = 0.12; // ~13.5 km span
    const lngSpan = 0.14; // ~14.5 km span

    return {
      minLat: centerLat - latSpan / 2,
      maxLat: centerLat + latSpan / 2,
      minLng: centerLng - lngSpan / 2,
      maxLng: centerLng + lngSpan / 2,
    };
  }, []);

  // Lat / Lng to SVG X/Y coordinate projection
  const projectCoords = (lat: number, lng: number, width: number, height: number) => {
    const { minLat, maxLat, minLng, maxLng } = mapBoundingBox;
    const normX = (lng - minLng) / (maxLng - minLng);
    const normY = (maxLat - lat) / (maxLat - minLat);

    // Apply zoom and pan offset centered at canvas middle
    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX + (normX - 0.5) * width * zoomLevel + mapCenterOffset.x;
    const y = centerY + (normY - 0.5) * height * zoomLevel + mapCenterOffset.y;

    return { x, y };
  };

  // Convert km radius to SVG pixels
  const getRadiusPixels = (km: number, width: number) => {
    const { minLng, maxLng } = mapBoundingBox;
    const degWidth = maxLng - minLng;
    // 1 deg lng at 22.7 deg latitude ≈ 102 km
    const kmWidth = degWidth * 102;
    const pxPerKm = (width / kmWidth) * zoomLevel;
    return km * pxPerKm;
  };

  // Drag handlers for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapCenterOffset.x, y: e.clientY - mapCenterOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapCenterOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset viewport center
  const handleResetCenter = () => {
    setZoomLevel(1.2);
    setMapCenterOffset({ x: 0, y: 0 });
    setSelectedWorkerId(null);
  };

  // Focus a specific worker
  const handleFocusWorker = (w: WorkerWithGeo) => {
    setSelectedWorkerId(w.id);
  };

  // Stats summary
  const availableCount = enrichedWorkers.filter((w) => w.computedStatus === 'AVAILABLE').length;
  const busyCount = enrichedWorkers.filter((w) => w.computedStatus === 'BUSY').length;
  const withinRadiusCount = filteredWorkers.length;

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-2 sm:inset-4 z-60 shadow-2xl' : 'w-full'
      }`}
    >
      {/* Top Map Control Bar */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
            <Radio size={20} className="animate-pulse text-blue-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                {t('Live_Artisan_Dispatch_Radar_j9q89', `Live Artisan Dispatch Radar`)}</h2>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {t('Indore_Urban_Zone_ewniy', `Indore Urban Zone`)}</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{userLocation.label}</span>
              <span>•</span>
              <span className="text-blue-300 font-medium">{withinRadiusCount} {t('artisans_in_f9eel', `artisans in`)}{maxRadiusKm} {t('km_jiuso', `km`)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Geolocation Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Geolocation Button */}
          <button
            id="btn-trigger-geolocation"
            onClick={handleRequestLiveLocation}
            disabled={geoPermissionStatus === 'LOCATING'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              geoPermissionStatus === 'SUCCESS' && userLocation.source === 'LIVE_GPS'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={t('Locate_via_device_GPS_k4jwv', `Locate via device GPS`)}
          >
            <Crosshair
              size={14}
              className={geoPermissionStatus === 'LOCATING' ? 'animate-spin' : ''}
            />
            <span>
              {geoPermissionStatus === 'LOCATING'
                ? 'Acquiring GPS...'
                : userLocation.source === 'LIVE_GPS'
                ? 'GPS Active'
                : 'Use My Live GPS'}
            </span>
          </button>

          {/* Preset Address Selector */}
          {customerAddresses && customerAddresses.length > 0 && (
            <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs">
              {customerAddresses.map((addr) => {
                const isActive =
                  (addr.label === 'Home' && userLocation.source === 'HOME_ADDRESS') ||
                  (addr.label === 'Office' && userLocation.source === 'OFFICE_ADDRESS');
                return (
                  <button
                    key={addr.id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {addr.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Map Engine Toggle */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setMapEngine('GEOAPIFY')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mapEngine === 'GEOAPIFY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t('Geoapify_Maps_Integration_e7und', `Geoapify Maps Integration`)}
            >
              <Layers size={13} />
              <span>{t('Geoapify_Map_teh9u', `Geoapify Map`)}</span>
            </button>
            <button
              onClick={() => setMapEngine('GIS_RADAR')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mapEngine === 'GIS_RADAR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t('Indore_GIS_Radar_Projection_tqz14', `Indore GIS Radar Projection`)}
            >
              <Radio size={13} />
              <span>{t('Radar_View_hwl1m', `Radar View`)}</span>
            </button>
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('SPLIT')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                activeTab === 'SPLIT' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Split_View_6905l', `Split View`)}</button>
            <button
              onClick={() => setActiveTab('MAP_ONLY')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                activeTab === 'MAP_ONLY' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Map_Only_bhgc5', `Map Only`)}</button>
            <button
              onClick={() => setActiveTab('LIST_ONLY')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                activeTab === 'LIST_ONLY' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('List_Only_1yvna', `List Only`)}</button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Radar'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Geolocation Notice / Alert if Denied */}
      {geoErrorMsg && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <AlertCircle size={14} className="text-amber-600 shrink-0" />
            <span>{geoErrorMsg}</span>
          </div>
          <button
            onClick={() => setGeoErrorMsg(null)}
            className="text-amber-700 hover:text-amber-900 font-bold"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <Filter size={12} /> {t('Status__zzixm', `Status:`)}</span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('All___3xe62', `All (`)}{enrichedWorkers.length})
          </button>
          <button
            onClick={() => setStatusFilter('AVAILABLE')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'AVAILABLE'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t('Available___97dqp', `Available (`)}{availableCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('BUSY')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'BUSY'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{t('On_Job___4re4f', `On Job (`)}{busyCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('OFF_DUTY')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              statusFilter === 'OFF_DUTY'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('Off_Duty_p6oxi', `Off Duty`)}</button>
        </div>

        {/* Radius & Trade Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Trade Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-semibold">{t('Trade__5oxoi', `Trade:`)}</span>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">{t('All_Crafts___Trades_03nd1', `All Crafts & Trades`)}</option>
              {availableTrades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Search Radius Slider */}
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold">{t('Radius__lav6w', `Radius:`)}</span>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              className="w-16 sm:w-24 accent-blue-600 cursor-pointer"
            />
            <span className="font-bold text-slate-900 font-mono w-10 text-right">
              {maxRadiusKm} {t('km_eaum5', `km`)}</span>
          </div>

          {/* Reset Map Center */}
          <button
            onClick={handleResetCenter}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors"
            title={t('Reset_Map_View___Center_04y9k', `Reset Map View & Center`)}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Content Area: Map and/or List */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-[460px] max-h-[640px] relative overflow-hidden">
        {/* Map Viewport: Google Maps or SVG GIS Canvas */}
        {(activeTab === 'SPLIT' || activeTab === 'MAP_ONLY') && (
          <div
            className={`relative bg-slate-950 select-none overflow-hidden ${
              activeTab === 'MAP_ONLY' ? 'w-full h-full' : 'flex-1 h-[420px] lg:h-auto'
            }`}
          >
            {mapEngine === 'GEOAPIFY' ? (
              <GeoapifyWorkerMap
                workers={filteredWorkers as any}
                userLocation={userLocation}
                selectedWorkerId={selectedWorkerId}
                onSelectWorker={(w) => setSelectedWorkerId(w.id)}
                onBookWorker={onSelectWorkerService}
                onLocateUser={handleRequestLiveLocation}
                maxRadiusKm={maxRadiusKm}
              />
            ) : (
              <div
                className="w-full h-full relative select-none overflow-hidden isolate"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* SVG Interactive Canvas */}
                <svg
                  ref={mapSvgRef}
                  onClick={handleMapSvgClick}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  viewBox="0 0 800 600"
                  preserveAspectRatio="xMidYMid slice"
                >
              <defs>
                {/* Radar Grid Pattern */}
                <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
                </pattern>

                {/* Radar Radial Sweep Gradient */}
                <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                </radialGradient>

                {/* Glow Filter for Active Pins */}
                <filter id="pinGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Map Background with Grid */}
              <rect width="800" height="600" fill="#090d16" />
              <rect width="800" height="600" fill="url(#radarGrid)" />

              {/* Major Indore Transport Arteries */}
              <g id="indore-roads" opacity="0.7">
                {INDORE_ROADS.map((road) => {
                  const pathData = road.points
                    .map((p, idx) => {
                      const proj = projectCoords(p.lat, p.lng, 800, 600);
                      return `${idx === 0 ? 'M' : 'L'} ${proj.x} ${proj.y}`;
                    })
                    .join(' ');
                  return (
                    <g key={road.name}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#334155"
                        strokeWidth={road.name === 'Ring Road' ? 4 : 3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#475569"
                        strokeWidth={road.name === 'Ring Road' ? 1.5 : 1}
                        strokeDasharray={road.name === 'Ring Road' ? '6 4' : 'none'}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Prominent Landmark Tags */}
              <g id="indore-landmarks" opacity="0.65">
                {INDORE_LANDMARKS.map((lm) => {
                  const pos = projectCoords(lm.lat, lm.lng, 800, 600);
                  return (
                    <g key={lm.name} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="2.5" fill="#64748b" />
                      <text
                        x="5"
                        y="3"
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="500"
                        fontFamily="system-ui"
                        className="pointer-events-none select-none"
                      >
                        {lm.name}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Citizen Service Location & Search Radius Rings */}
              {(() => {
                const userPos = projectCoords(userLocation.lat, userLocation.lng, 800, 600);
                const radiusPx = getRadiusPixels(maxRadiusKm, 800);
                const innerRadiusPx = getRadiusPixels(2, 800);

                return (
                  <g id="citizen-location-group">
                    {/* Radius Circle */}
                    {showRadiusZone && (
                      <>
                        <circle
                          cx={userPos.x}
                          cy={userPos.y}
                          r={radiusPx}
                          fill="url(#radarSweep)"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          strokeDasharray="5 3"
                          opacity="0.8"
                        />
                        <circle
                          cx={userPos.x}
                          cy={userPos.y}
                          r={innerRadiusPx}
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="0.8"
                          strokeDasharray="2 2"
                          opacity="0.5"
                        />
                        {/* Radius Label */}
                        <text
                          x={userPos.x}
                          y={userPos.y - radiusPx - 6}
                          fill="#93c5fd"
                          fontSize="10"
                          textAnchor="middle"
                          fontWeight="bold"
                          fontFamily="system-ui"
                        >
                          {t('Dispatch_Boundary__8t054', `Dispatch Boundary:`)}{maxRadiusKm} {t('km_javlo', `km`)}</text>
                      </>
                    )}

                    {/* Connection Line to Selected Worker if focused */}
                    {selectedWorker && (
                      (() => {
                        const targetPos = projectCoords(
                          selectedWorker.currentLocation?.lat || 22.7196,
                          selectedWorker.currentLocation?.lng || 75.8577,
                          800,
                          600
                        );
                        return (
                          <g>
                            <line
                              x1={userPos.x}
                              y1={userPos.y}
                              x2={targetPos.x}
                              y2={targetPos.y}
                              stroke="#60a5fa"
                              strokeWidth="2"
                              strokeDasharray="6 4"
                              strokeLinecap="round"
                              opacity="0.9"
                            />
                            {/* Midpoint Distance Badge */}
                            <rect
                              x={(userPos.x + targetPos.x) / 2 - 30}
                              y={(userPos.y + targetPos.y) / 2 - 10}
                              width="60"
                              height="20"
                              rx="5"
                              fill="#1e293b"
                              stroke="#3b82f6"
                              strokeWidth="1"
                            />
                            <text
                              x={(userPos.x + targetPos.x) / 2}
                              y={(userPos.y + targetPos.y) / 2 + 4}
                              fill="#ffffff"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                              fontFamily="system-ui"
                            >
                              {selectedWorker.distanceKm} {t('km_diwrw', `km`)}</text>
                          </g>
                        );
                      })()
                    )}

                    {/* Citizen Marker Pulse */}
                    <circle cx={userPos.x} cy={userPos.y} r="16" fill="#2563eb" opacity="0.3">
                      <animate
                        attributeName="r"
                        values="10;24;10"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.5;0.1;0.5"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Citizen Central Pin */}
                    <circle cx={userPos.x} cy={userPos.y} r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
                    <circle cx={userPos.x} cy={userPos.y} r="2.5" fill="#ffffff" />

                    {/* Citizen Label Pill */}
                    <g transform={`translate(${userPos.x}, ${userPos.y + 14})`}>
                      <rect
                        x="-48"
                        y="0"
                        width="96"
                        height="18"
                        rx="9"
                        fill="#1e293b"
                        stroke="#3b82f6"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="12"
                        fill="#93c5fd"
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="system-ui"
                      >
                        {t('Service_Location_j4adz', `Service Location`)}</text>
                    </g>
                  </g>
                );
              })()}

              {/* Workers Pins Plotted on Map */}
              <g id="workers-layer">
                {filteredWorkers.map((w) => {
                  const pos = projectCoords(
                    w.currentLocation?.lat || 22.7196,
                    w.currentLocation?.lng || 75.8577,
                    800,
                    600
                  );
                  const isSelected = w.id === selectedWorkerId;
                  const isAvailable = w.computedStatus === 'AVAILABLE';

                  return (
                    <g
                      key={w.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFocusWorker(w);
                      }}
                    >
                      {/* Halo if selected */}
                      {isSelected && (
                        <circle r="22" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="4 2">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0"
                            to="360"
                            dur="10s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Pulsing radar wave for available artisans */}
                      {isAvailable && (
                        <circle r="15" fill="#10b981" opacity="0.25">
                          <animate
                            attributeName="r"
                            values="12;20;12"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.35;0.05;0.35"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Pin Bubble */}
                      <circle
                        r={isSelected ? '14' : '11'}
                        fill={w.statusColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter={isSelected ? 'url(#pinGlow)' : 'none'}
                      />

                      {/* Trade Symbol / Initial */}
                      <text
                        x="0"
                        y="3.5"
                        fill="#ffffff"
                        fontSize={isSelected ? '11' : '9'}
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="system-ui"
                        className="pointer-events-none select-none"
                      >
                        {w.primaryTrade ? w.primaryTrade[0] : 'W'}
                      </text>

                      {/* Status indicator pip */}
                      <circle
                        cx="8"
                        cy="-8"
                        r="3.5"
                        fill={isAvailable ? '#10b981' : w.computedStatus === 'BUSY' ? '#3b82f6' : '#94a3b8'}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />

                      {/* Verified Shield Indicator Pip */}
                      <g transform="translate(-8, -8)">
                        <circle
                          cx="0"
                          cy="0"
                          r="4"
                          fill={w.trustScore >= 90 ? '#059669' : w.trustScore >= 80 ? '#2563eb' : '#0d9488'}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="2.5"
                          fill="#ffffff"
                          fontSize="6"
                          fontWeight="900"
                          textAnchor="middle"
                          fontFamily="system-ui"
                          className="pointer-events-none select-none"
                        >
                          ✓
                        </text>
                      </g>

                      {/* Micro Label Tag */}
                      <g transform="translate(0, 18)">
                        <rect
                          x="-38"
                          y="0"
                          width="76"
                          height="14"
                          rx="4"
                          fill="#0f172a"
                          stroke="#334155"
                          strokeWidth="0.8"
                          opacity="0.9"
                        />
                        <text
                          x="0"
                          y="10"
                          fill="#f8fafc"
                          fontSize="8"
                          fontWeight="600"
                          textAnchor="middle"
                          fontFamily="system-ui"
                          className="pointer-events-none select-none"
                        >
                          {w.name.split(' ')[0]} {t('______kbl79', `• 🛡️`)}{w.trustScore}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Map Overlay Controls (+/- Zoom, Reset, Legend) */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20 pointer-events-auto">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.3, 3))}
                className="w-8 h-8 rounded-xl bg-slate-900/95 text-white hover:bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm shadow-md transition-all active:scale-95"
                title={t('Zoom_In_1qisy', `Zoom In`)}
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7))}
                className="w-8 h-8 rounded-xl bg-slate-900/95 text-white hover:bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm shadow-md transition-all active:scale-95"
                title={t('Zoom_Out_z5jnh', `Zoom Out`)}
              >
                −
              </button>
              <button
                onClick={() => setShowRadiusZone(!showRadiusZone)}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-md transition-all active:scale-95 ${
                  showRadiusZone
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-900/95 text-slate-400 border-slate-700'
                }`}
                title={t('Toggle_5km_Dispatch_Ring_450al', `Toggle 5km Dispatch Ring`)}
              >
                <Compass size={15} />
              </button>
            </div>

            {/* Floating Map Legend (Bottom-Left) */}
            <div className="absolute bottom-3 left-3 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 rounded-xl p-2.5 text-[11px] shadow-lg flex flex-wrap items-center gap-2.5 max-w-[calc(100%-5rem)] sm:max-w-none">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{t('Available_yiife', `Available`)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>{t('On_Job_td2mp', `On Job`)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>{t('Off_Duty_du9ql', `Off Duty`)}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-2">
                <Navigation size={12} className="text-blue-400" />
                <span>{t('Tap_map_to_re_pin_mb6kg', `Tap map to re-pin`)}</span>
              </div>
            </div>

            {/* Floating Inspection Card on Map (When Worker Clicked) */}
            {selectedWorker && (
              <div className="absolute top-3 left-3 max-w-[calc(100%-4.5rem)] sm:max-w-sm w-full bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                      {getTradeIcon(selectedWorker.primaryTrade, 18)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {selectedWorker.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-semibold text-blue-700">{selectedWorker.primaryTrade}</span>
                        <span>•</span>
                        <span>{selectedWorker.societyName?.split(' ')[0] || 'Cooperative'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedWorkerId(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Status & ETA Badge */}
                <div className="mt-3 flex items-center justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedWorker.statusColor }}
                    ></span>
                    <span className="font-bold" style={{ color: selectedWorker.statusColor }}>
                      {selectedWorker.statusLabel}
                    </span>
                  </div>
                  <div className="text-slate-700 font-semibold flex items-center gap-1">
                    <Clock size={12} className="text-blue-600" />
                    <span>
                      {selectedWorker.distanceKm} {t('km___3ehdm', `km (`)}{selectedWorker.etaMinutes}{t('m_ETA__pgbnn', `m ETA)`)}</span>
                  </div>
                </div>

                {/* Visual Identity Verified Badge with Aadhaar & Trust Score */}
                <div className="mt-2.5">
                  <IdentityVerifiedBadge
                    worker={selectedWorker}
                    variant="badge"
                    showAadhaarSnippet={true}
                    showCompletedJobs={true}
                    interactive={true}
                    className="w-full"
                  />
                </div>

                {/* Rating & Completed Jobs Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="bg-slate-50 text-slate-800 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-medium text-slate-500 flex items-center gap-1">
                      <Briefcase size={12} className="text-blue-600" />
                      {t('Completed_kffv2', `Completed`)}</span>
                    <span className="font-bold text-slate-900">{selectedWorker.completedJobs} {t('jobs_vx4pv', `jobs`)}</span>
                  </div>
                  <div className="bg-amber-50 text-amber-900 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      {t('Rating_glpi3', `Rating`)}</span>
                    <span className="font-bold">
                      {selectedWorker.rating > 0 ? selectedWorker.rating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>

                {/* Action: Book Worker */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectWorkerService) {
                        onSelectWorkerService(selectedWorker.primaryTrade, selectedWorker);
                      }
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                      selectedWorker.computedStatus === 'AVAILABLE'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>
                      {selectedWorker.computedStatus === 'AVAILABLE'
                        ? `Book ${selectedWorker.primaryTrade} Service`
                        : `View ${selectedWorker.primaryTrade} Services`}
                    </span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
              </div>
            )}
          </div>
        )}

        {/* Side/Tab List View of Nearby Artisans */}
        {(activeTab === 'SPLIT' || activeTab === 'LIST_ONLY') && (
          <div
            className={`bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 ${
              activeTab === 'LIST_ONLY' ? 'w-full' : 'lg:w-[340px] xl:w-[380px] shrink-0'
            }`}
          >
            {/* List Header & Sorting */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2 text-xs">
              <div className="font-bold text-slate-800">
                {t('Nearby_Artisans___sgpei', `Nearby Artisans (`)}{filteredWorkers.length})
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-500">{t('Sort__6faxf', `Sort:`)}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="DISTANCE">{t('Nearest_Distance_22k9d', `Nearest Distance`)}</option>
                  <option value="RATING">{t('Highest_Rating_sriat', `Highest Rating`)}</option>
                  <option value="TRUST">{t('Trust_Score_nk4bs', `Trust Score`)}</option>
                </select>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[400px] lg:max-h-none">
              {filteredWorkers.length === 0 ? (
                <div className="text-center py-10 px-4 text-slate-400 space-y-2">
                  <AlertCircle size={28} className="mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">
                    {t('No_artisans_match_the_selected_ei2h4', `No artisans match the selected radius & filters.`)}</p>
                  <p className="text-[11px]">
                    {t('Try_expanding_the_radius_slide_7puqj', `Try expanding the radius slider or choosing &quot;All Crafts&quot;.`)}</p>
                  <button
                    onClick={() => {
                      setSelectedTrade('ALL');
                      setStatusFilter('ALL');
                      setMaxRadiusKm(15);
                    }}
                    className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    {t('Expand_Radius_to_15_km_hsjcq', `Expand Radius to 15 km`)}</button>
                </div>
              ) : (
                filteredWorkers.map((worker) => {
                  const isSelected = worker.id === selectedWorkerId;
                  const isAvailable = worker.computedStatus === 'AVAILABLE';

                  return (
                    <div
                      key={worker.id}
                      onClick={() => handleFocusWorker(worker)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                            {getTradeIcon(worker.primaryTrade, 16)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{worker.name}</span>
                              {worker.verificationStatus === 'VERIFIED' && (
                                <span title={t('Aadhaar___Society_Verified_e478r', `Aadhaar & Society Verified`)}>
                                  <ShieldCheck size={13} className="text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-blue-600">
                                {worker.primaryTrade}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">
                                {worker.currentLocation?.address?.split(',')[0] || 'Indore'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Chip */}
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : worker.computedStatus === 'BUSY'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: worker.statusColor }}
                            ></span>
                            <span>{worker.statusLabel}</span>
                          </span>
                        </div>
                      </div>

                      {/* Distance, ETA & Visual Identity Verified Shield Badge */}
                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 gap-2">
                        <div className="flex items-center gap-2.5 text-slate-600 shrink-0">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <Navigation size={11} className="text-blue-600" />
                            {worker.distanceKm} {t('km_4iwfe', `km`)}</span>
                          <span className="flex flex-wrap items-center gap-1">
                            <Clock size={11} className="text-slate-400" />
                            ~{worker.etaMinutes}m
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-semibold text-slate-600 flex items-center gap-0.5 text-[10px] mr-0.5">
                            <Star size={11} className="text-amber-500 fill-amber-500" />
                            {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}
                          </span>
                          <IdentityVerifiedBadge
                            worker={worker}
                            variant="compact"
                            showAadhaarSnippet={true}
                            interactive={true}
                          />
                        </div>
                      </div>

                      {/* Quick Book Button */}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectWorkerService) {
                              onSelectWorkerService(worker.primaryTrade, worker);
                            }
                          }}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <span>{t('Dispatch_1t1yy', `Dispatch`)}{worker.primaryTrade} {t('Artisan_gs02k', `Artisan`)}</span>
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* List Footer Policy Note */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex flex-wrap items-center gap-1">
                <Info size={12} className="text-blue-500 shrink-0" />
                {t('Dispatched_under_MP_Coop_Labou_2tnuo', `Dispatched under MP Coop Labour Policy (94.5% artisan wage)`)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
