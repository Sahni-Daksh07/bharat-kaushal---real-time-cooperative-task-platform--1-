import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Crosshair,
  Layers,
  Plus,
  Minus,
  Play,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Radio,
  Users,
  Compass,
} from 'lucide-react';
import { WorkerProfile, Booking } from '../../types';
import { getEffectiveGeoapifyKey, maskGeoapifyKey } from '../../utils/geoapifyConfig';

interface WorkerJobMapProps {
  worker: WorkerProfile;
  booking?: Booking;
  allWorkers?: WorkerProfile[];
  onSimulateStep?: (bookingId: string) => void;
  onWorkerArrived?: (bookingId: string) => void;
  onStartJourney?: (bookingId: string) => void;
}

type GeoapifyStyle =
  | 'osm-bright'
  | 'dark-matter'
  | 'positron'
  | 'klokantech-basic';

const STYLE_OPTIONS: { id: GeoapifyStyle; label: string }[] = [
  { id: 'osm-bright', label: 'Standard' },
  { id: 'dark-matter', label: 'Dark' },
  { id: 'positron', label: 'Light' },
  { id: 'klokantech-basic', label: 'Topo' },
];

const INDORE_DEMAND_HUBS = [
  { name: 'Vijay Nagar Square', lat: 22.7533, lng: 75.8937, demand: 'High (Plumbing/AC)' },
  { name: 'Palasia Junction', lat: 22.7244, lng: 75.8839, demand: 'Very High (Electrical)' },
  { name: 'Bhawarkua Circle', lat: 22.6926, lng: 75.8676, demand: 'High (Appliance)' },
  { name: 'Rajwada Old City', lat: 22.7186, lng: 75.8554, demand: 'Moderate (Carpentry)' },
  { name: 'Super Corridor IT Hub', lat: 22.7750, lng: 75.8200, demand: 'Surging (Cleaning)' },
];

function getTradeSymbol(trade?: string) {
  const t = (trade || '').toLowerCase();
  if (t.includes('plumb')) return '🔧';
  if (t.includes('electr')) return '⚡';
  if (t.includes('clean')) return '✨';
  if (t.includes('ac') || t.includes('appliance')) return '❄️';
  if (t.includes('carp')) return '🔨';
  return '💼';
}

export const WorkerJobMap: React.FC<WorkerJobMapProps> = ({
  worker,
  booking,
  allWorkers = [],
  onSimulateStep,
  onWorkerArrived,
  onStartJourney,
}) => {
  // Geoapify Key from env, localStorage, or obfuscated fallback
  const envKey: string = (import.meta as any).env?.VITE_GEOAPIFY_API_KEY || '';
  const [activeKey, setActiveKey] = useState<string>(() => getEffectiveGeoapifyKey());

  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<GeoapifyStyle>('osm-bright');
  const [coverageRadiusKm, setCoverageRadiusKm] = useState<number>(5);
  const [showDemandHubs, setShowDemandHubs] = useState<boolean>(true);
  const [showNearbyComrades, setShowNearbyComrades] = useState<boolean>(true);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const elementsLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Worker coordinates fallback to Indore center if missing
  const workerLat =
    booking?.workerLocation?.lat ??
    worker.currentLocation?.lat ??
    22.7196;
  const workerLng =
    booking?.workerLocation?.lng ??
    worker.currentLocation?.lng ??
    75.8577;

  // Customer coordinates fallback (auto-detect known Indore landmarks e.g. Navlakha Square)
  const customerLat =
    booking?.customerAddress?.lat ??
    (booking?.customerAddress?.address?.toLowerCase().includes('navlakha') ? 22.7051 : 22.7533);
  const customerLng =
    booking?.customerAddress?.lng ??
    (booking?.customerAddress?.address?.toLowerCase().includes('navlakha') ? 75.8752 : 75.8937);

  const hasJob = Boolean(booking && (booking.customerAddress?.address || booking.customerAddress?.lat));
  const isNavigableJob =
    booking &&
    ['CONFIRMED', 'TRAVELLING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETION_PENDING'].includes(
      booking.status
    );

  // Handle key save/clear
  const handleSaveKey = (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) {
      setKeyError('Please enter a valid Geoapify API key');
      return;
    }
    try {
      localStorage.setItem('GEOAPIFY_API_KEY', trimmed);
    } catch (e) {
      console.warn('Could not store Geoapify key', e);
    }
    setActiveKey(trimmed);
    setShowKeyModal(false);
    setKeyError('');
  };

  const handleClearKey = () => {
    try {
      localStorage.removeItem('GEOAPIFY_API_KEY');
    } catch {
      // ignore
    }
    setActiveKey('');
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter: [number, number] = hasJob
      ? [(workerLat + customerLat) / 2, (workerLng + customerLng) / 2]
      : [workerLat, workerLng];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: hasJob ? 13 : 13,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    const elementsLayer = L.layerGroup().addTo(map);
    elementsLayerRef.current = elementsLayer;

    const tileUrl = activeKey
      ? `https://maps.geoapify.com/v1/tile/${currentStyle}/{z}/{x}/{y}.png?apiKey=${activeKey}`
      : `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: activeKey
        ? 'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);

    tileLayer.on('tileerror', () => {
      if (activeKey) {
        tileLayer.setUrl('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
      }
    });

    tileLayerRef.current = tileLayer;

    // Invalidate map size after short delay to handle modal rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeKey, hasJob]);

  // Update map style when changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl = activeKey
      ? `https://maps.geoapify.com/v1/tile/${currentStyle}/{z}/{x}/{y}.png?apiKey=${activeKey}`
      : `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;

    const newLayer = L.tileLayer(tileUrl, {
      attribution: activeKey
        ? 'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(mapInstanceRef.current);

    newLayer.on('tileerror', () => {
      if (activeKey) {
        newLayer.setUrl('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
      }
    });

    tileLayerRef.current = newLayer;
  }, [currentStyle, activeKey]);

  // Render Map Elements (Markers, Polylines, Radius, Hubs)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const elementsLayer = elementsLayerRef.current;
    if (!map || !elementsLayer) return;

    elementsLayer.clearLayers();
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    const tradeSymbol = getTradeSymbol(worker.primaryTrade);

    // 1. Worker Marker (My Location)
    const workerMarkerHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 140px; margin-left: -70px; margin-top: -20px; pointer-events: auto;">
        <div style="width: 36px; height: 36px; border-radius: 9999px; background-color: #2563eb; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(37,99,235,0.4); border: 2.5px solid #ffffff;">
          <span style="font-size: 16px;">${tradeSymbol}</span>
        </div>
        <div style="margin-top: 3px; background-color: #0f172a; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          You (${worker.name.split(' ')[0]})
        </div>
      </div>
    `;

    const workerIcon = L.divIcon({
      className: 'worker-my-marker',
      html: workerMarkerHtml,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    const workerMarker = L.marker([workerLat, workerLng], {
      icon: workerIcon,
      zIndexOffset: 1000,
    });
    workerMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 170px;">
        <div style="font-weight: 800; color: #2563eb;">📍 Your Live Location</div>
        <div style="margin-top: 2px; font-weight: 600;">${worker.name}</div>
        <div style="font-size: 10px; color: #64748b;">${worker.primaryTrade} • ${worker.societyName || 'Indore Sahakari Samiti'}</div>
        <div style="margin-top: 4px; font-size: 10px; color: #059669; font-weight: 700;">
          Status: ${worker.availability ? 'Online & Available' : 'Offline'}
        </div>
      </div>
    `);
    elementsLayer.addLayer(workerMarker);

    // 2. Active Job Route & Customer Marker
    if (hasJob && booking) {
      const isCancelled = booking.status === 'CANCELLED';
      const isCompleted = ['COMPLETED', 'PAID', 'SETTLED'].includes(booking.status);
      const markerColor = isCancelled ? '#e11d48' : isCompleted ? '#059669' : '#dc2626';
      const badgeBg = isCancelled ? '#9f1239' : isCompleted ? '#065f46' : '#991b1b';
      const badgeText = isCancelled ? 'Cancelled Job' : isCompleted ? 'Completed Job' : 'Target Doorstep';

      // Customer Doorstep Marker
      const customerMarkerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 160px; margin-left: -80px; margin-top: -20px; pointer-events: auto;">
          <div style="width: 38px; height: 38px; border-radius: 9999px; background-color: ${markerColor}; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid #ffffff;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div style="margin-top: 3px; background-color: ${badgeBg}; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${badgeText}: ${booking.customerName}
          </div>
        </div>
      `;

      const customerIcon = L.divIcon({
        className: 'customer-doorstep-marker',
        html: customerMarkerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const customerMarker = L.marker([customerLat, customerLng], {
        icon: customerIcon,
        zIndexOffset: 900,
      });

      customerMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 200px;">
          <div style="font-weight: 800; color: ${markerColor};">🎯 Customer Doorstep</div>
          <div style="margin-top: 2px; font-weight: 700; font-size: 13px;">${booking.customerName}</div>
          <div style="font-size: 11px; color: #334155; margin-top: 2px; font-weight: 500;">${booking.customerAddress.address}, Indore</div>
          ${
            booking.customerAddress.landmark
              ? `<div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-top: 1px;">Landmark: ${booking.customerAddress.landmark}</div>`
              : ''
          }
          <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 800; color: #059669;">₹${booking.pricing.workerShare} Share</span>
            <span style="font-size: 10px; color: #64748b;">${booking.serviceName}</span>
          </div>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${customerLat},${customerLng}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #2563eb; color: white; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-decoration: none;">
              Open in Native GPS Navigation →
            </a>
          </div>
        </div>
      `);
      elementsLayer.addLayer(customerMarker);

      // Routing Polyline
      const routePoints: [number, number][] = [
        [workerLat, workerLng],
        [(workerLat + customerLat) / 2 + 0.003, (workerLng + customerLng) / 2 - 0.002],
        [customerLat, customerLng],
      ];

      const polyline = L.polyline(routePoints, {
        color: isCancelled ? '#94a3b8' : isCompleted ? '#059669' : '#2563eb',
        weight: 4,
        opacity: 0.85,
        dashArray: isCancelled ? '4, 8' : booking.status === 'TRAVELLING' ? '8, 8' : undefined,
      }).addTo(map);
      routeLineRef.current = polyline;

      // Fit bounds to show both worker and customer
      map.fitBounds([
        [workerLat, workerLng],
        [customerLat, customerLng],
      ], { padding: [50, 50], maxZoom: 16 });
    } else {
      // 3. Standby Mode: Service Coverage Circle
      const circle = L.circle([workerLat, workerLng], {
        radius: coverageRadiusKm * 1000,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.07,
        weight: 1.5,
        dashArray: '6, 6',
      });
      elementsLayer.addLayer(circle);

      // Nearby Demand Hotspots
      if (showDemandHubs) {
        INDORE_DEMAND_HUBS.forEach((hub) => {
          const hubHtml = `
            <div style="display: flex; align-items: center; gap: 4px; background-color: rgba(15, 23, 42, 0.85); color: #f8fafc; padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 700; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3); pointer-events: auto;">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: #f59e0b;"></span>
              <span>${hub.name.split(' ')[0]}</span>
            </div>
          `;
          const hubIcon = L.divIcon({
            className: 'demand-hub-pill',
            html: hubHtml,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          });
          const hubMarker = L.marker([hub.lat, hub.lng], { icon: hubIcon });
          hubMarker.bindPopup(`
            <div style="font-family: inherit; font-size: 11px;">
              <strong>${hub.name}</strong>
              <div style="color: #d97706; font-weight: 700; margin-top: 2px;">⚡ Demand: ${hub.demand}</div>
              <div style="color: #64748b; font-size: 10px;">High dispatch allocation zone</div>
            </div>
          `);
          elementsLayer.addLayer(hubMarker);
        });
      }

      // Nearby Comrades / Fellow Workers
      if (showNearbyComrades && allWorkers.length > 0) {
        allWorkers
          .filter((w) => w.id !== worker.id)
          .slice(0, 8)
          .forEach((comrade) => {
            const cLat = comrade.currentLocation?.lat ?? 22.7196 + (Math.random() - 0.5) * 0.04;
            const cLng = comrade.currentLocation?.lng ?? 75.8577 + (Math.random() - 0.5) * 0.04;
            const cSymbol = getTradeSymbol(comrade.primaryTrade);

            const comradeHtml = `
              <div style="display: flex; align-items: center; gap: 3px; background-color: #ffffff; color: #0f172a; padding: 2px 6px; border-radius: 9999px; font-size: 9px; font-weight: 700; border: 1px solid #cbd5e1; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.15); pointer-events: auto;">
                <span style="font-size: 9px;">${cSymbol}</span>
                <span>${comrade.name.split(' ')[0]}</span>
              </div>
            `;
            const comradeIcon = L.divIcon({
              className: 'comrade-marker-pill',
              html: comradeHtml,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            });
            const cMarker = L.marker([cLat, cLng], { icon: comradeIcon });
            cMarker.bindPopup(`
              <div style="font-family: inherit; font-size: 11px;">
                <strong>${comrade.name}</strong> (${comrade.primaryTrade})
                <div style="color: #64748b; font-size: 10px;">${comrade.societyName || 'Cooperative Comrade'}</div>
                <div style="font-size: 10px; color: ${comrade.availability ? '#059669' : '#d97706'}; font-weight: 700; margin-top: 2px;">
                  ${comrade.availability ? 'Online on duty' : 'On job / Offline'}
                </div>
              </div>
            `);
            elementsLayer.addLayer(cMarker);
          });
      }
    }
  }, [
    workerLat,
    workerLng,
    customerLat,
    customerLng,
    hasJob,
    booking?.status,
    coverageRadiusKm,
    showDemandHubs,
    showNearbyComrades,
    allWorkers,
    worker,
  ]);

  // Center on worker
  const handleCenterWorker = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([workerLat, workerLng], 14, { animate: true });
    }
  };

  // Center on whole route
  const handleFitRoute = () => {
    if (mapInstanceRef.current && hasJob) {
      mapInstanceRef.current.fitBounds([
        [workerLat, workerLng],
        [customerLat, customerLng],
      ], { padding: [50, 50] });
    }
  };

  return (
    <div className="w-full h-full min-h-[380px] relative flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md isolate">
      {/* Unified Top Map HUD Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex flex-wrap items-start justify-between gap-2">
        {/* Left Controls Group */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {/* Style selector */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-0.5 flex items-center text-xs">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentStyle(style.id)}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all ${
                  currentStyle === style.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Center My GPS */}
          <button
            onClick={handleCenterWorker}
            className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 px-2.5 py-1 rounded-xl shadow-md border border-slate-200/80 text-xs font-bold w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 transition-all active:scale-95"
            title={t('Recenter_on_My_GPS_Location_3utvv', `Recenter on My GPS Location`)}
          >
            <Crosshair size={13} className="text-blue-600" />
            <span className="hidden sm:inline">{t('My_GPS_0n6xu', `My GPS`)}</span>
          </button>

          {hasJob && (
            <button
              onClick={handleFitRoute}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-xl shadow-md text-xs font-bold w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 transition-all active:scale-95"
              title={t('Fit_Navigation_Route_lnjd2', `Fit Navigation Route`)}
            >
              <Compass size={13} />
              <span>{t('Route_lqf1c', `Route`)}</span>
            </button>
          )}

          {/* Toggle Overlays when idle */}
          {!hasJob && (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[11px] border border-slate-700/80 shadow-md">
              <button
                onClick={() => setShowDemandHubs(!showDemandHubs)}
                className={`font-semibold transition-colors ${
                  showDemandHubs ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {t('__Hubs_jvz0d', `⚡ Hubs`)}</button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setShowNearbyComrades(!showNearbyComrades)}
                className={`font-semibold transition-colors ${
                  showNearbyComrades ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {t('___Comrades_d4m7w', `👥 Comrades`)}</button>
            </div>
          )}
        </div>

        {/* Right Key Pill Group */}
        <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
          {activeKey ? (
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl shadow-md border border-slate-700/80 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-300">
                Geoapify: <code className="font-mono text-emerald-400">{maskGeoapifyKey(activeKey)}</code>
              </span>
              <button
                onClick={() => setShowKeyModal(true)}
                className="text-blue-400 hover:text-blue-300 underline font-bold ml-1"
                title={t('Edit_Key_uj03w', `Edit Key`)}
              >
                {t('Edit_us9vs', `Edit`)}</button>
            </div>
          ) : (
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl shadow-md font-bold text-xs transition-all active:scale-95"
            >
              <Sparkles size={13} />
              <span>{t('Enter_Key_qz8bx', `Enter Key`)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Zoom Buttons */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-7 h-7 rounded-lg bg-white shadow-md border border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center font-bold"
          title={t('Zoom_In_0rr7t', `Zoom In`)}
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-7 h-7 rounded-lg bg-white shadow-md border border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center font-bold"
          title={t('Zoom_Out_usney', `Zoom Out`)}
        >
          <Minus size={14} />
        </button>
      </div>

      {/* Active Navigation Floating Card (Bottom Left) */}
      {hasJob && booking && (
        <div className="absolute bottom-3 left-3 right-14 sm:right-auto sm:max-w-md z-20 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 border border-slate-700 shadow-xl pointer-events-auto space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isNavigableJob ? 'bg-blue-400 animate-ping' : booking.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-emerald-400'}`} />
              <span className="font-extrabold text-xs text-blue-300 uppercase tracking-wide">
                {isNavigableJob ? t('Active_Job_Route__ido25', `Active Job Route:`) : t('Job_Destination__ido25', `Job Destination:`)} {booking.serviceName}
              </span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              booking.status === 'CANCELLED'
                ? 'text-rose-400 bg-rose-950/60 border-rose-500/30'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
            }`}>
              {booking.status === 'CANCELLED' ? 'ORDER CANCELLED' : `₹${booking.pricing?.workerShare ?? 0}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-100">{booking.customerName}</div>
              <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                {booking.customerAddress.address}
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-sm text-blue-400">
                {booking.workerLocation?.distanceKm ?? '2.1'} {t('km_8bpuw', `km`)}</div>
              <div className="text-[10px] text-slate-400">
                {t('ETA___yxzcv', `ETA ~`)}{booking.workerLocation?.etaMinutes ?? '7'} {t('mins_vwgzz', `mins`)}</div>
            </div>
          </div>

          {/* Direct Navigation Action Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
            {booking.status === 'CONFIRMED' && onStartJourney && (
              <button
                onClick={() => onStartJourney(booking.id)}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Navigation size={13} />
                <span>{t('Start_Travelling_k89i8', `Start Travelling`)}</span>
              </button>
            )}

            {booking.status === 'TRAVELLING' && onSimulateStep && (
              <button
                onClick={() => onSimulateStep(booking.id)}
                className="py-1.5 px-2.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                title={t('Simulate_moving_closer_nvela', `Simulate moving closer`)}
              >
                <Play size={12} />
                <span>{t('GPS_Step___0_4_km__nfqpv', `GPS Step (-0.4 km)`)}</span>
              </button>
            )}

            {booking.status === 'TRAVELLING' && onWorkerArrived && (
              <button
                onClick={() => onWorkerArrived(booking.id)}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <MapPin size={13} />
                <span>{t('Arrived_at_Doorstep_i5r9c', `Arrived at Doorstep`)}</span>
              </button>
            )}

            {booking.status === 'CANCELLED' && (
              <span className="text-[11px] text-rose-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Service call was cancelled
              </span>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${customerLat},${customerLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 ml-auto shadow-xs"
              title={t('Open_in_Native_GPS_b4osj', `Open in Native GPS`)}
            >
              <span>{t('External_GPS_bsm2r', `Google Maps Navigation`)}</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}

      {/* Standby Radius Control (Bottom Left when Idle) */}
      {!hasJob && (
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-xs text-white rounded-2xl p-2.5 sm:p-3 border border-slate-700 shadow-lg pointer-events-auto flex items-center gap-3 text-xs max-w-[calc(100%-4.5rem)] sm:max-w-none">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Radio size={14} className="text-blue-400" />
            <span>{t('Coverage_Radius__h2zho', `Coverage Radius:`)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {[3, 5, 10].map((r) => (
              <button
                key={r}
                onClick={() => setCoverageRadiusKm(r)}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all ${
                  coverageRadiusKm === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r} {t('km_o4zbb', `km`)}</button>
            ))}
          </div>
        </div>
      )}

      {/* Key Config Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                  <Sparkles size={12} />
                  <span>{t('Geoapify_Maps_Configuration_x08px', `Geoapify Maps Configuration`)}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {t('Worker_Geoapify_Key_9tvbg', `Worker Geoapify Key`)}</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t('Geoapify_map_tiles_power_worke_hvot2', `Geoapify map tiles power worker routing, doorstep turn-by-turn navigation, and community coverage radar.`)}</p>

            <div className="space-y-2">
              <label htmlFor="worker-geoapify-key" className="text-xs font-bold text-slate-800 block">
                {t('Paste_your_Geoapify_API_Key__93h1d', `Paste your Geoapify API Key:`)}</label>
              <div className="flex gap-2">
                <input
                  id="worker-geoapify-key"
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setKeyError('');
                  }}
                  placeholder={t('Paste_your_Geoapify_key_here_qikbz', `Paste your Geoapify key here`)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveKey(inputKey)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  {t('Activate_esc4s', `Activate`)}</button>
              </div>
              {keyError && (
                <p className="text-[11px] font-semibold text-rose-600">{keyError}</p>
              )}
            </div>

            {activeKey && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {t('Active__7uyz1', `Active:`)}<code className="font-mono text-slate-700">{maskGeoapifyKey(activeKey)}</code>
                </span>
                <button
                  onClick={handleClearKey}
                  className="text-rose-600 hover:text-rose-700 font-semibold text-[11px]"
                >
                  {t('Remove_Key_znk6s', `Remove Key`)}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Element or Activation Prompt */}
      {activeKey ? (
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px] flex-1 z-0" />
      ) : (
        <div className="w-full h-full min-h-[380px] flex-1 flex items-center justify-center p-6 bg-slate-900 text-white">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center">
              <Navigation size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('Activate_Worker_Navigation_Map_fxmt8', `Activate Worker Navigation Map`)}</h3>
              <p className="text-xs text-slate-300 mt-1">
                {t('Enter_your_Geoapify_API_key_to_jvu9d', `Enter your Geoapify API key to enable live GPS routing, turn-by-turn customer doorstep tracking, and operational coverage radar.`)}</p>
            </div>

            <div className="space-y-2 text-left bg-slate-950/80 p-3 rounded-2xl border border-white/10">
              <label htmlFor="worker-zero-key" className="text-xs font-bold text-slate-200 block">
                {t('Geoapify_API_Key__8ltw1', `Geoapify API Key:`)}</label>
              <div className="flex gap-2">
                <input
                  id="worker-zero-key"
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setKeyError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveKey(inputKey);
                    }
                  }}
                  placeholder={t('Paste_Geoapify_API_key_dqxmr', `Paste Geoapify API key`)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveKey(inputKey)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1"
                >
                  <span>{t('Activate_jjw9r', `Activate`)}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
              {keyError && <p className="text-[11px] font-semibold text-rose-400">{keyError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
