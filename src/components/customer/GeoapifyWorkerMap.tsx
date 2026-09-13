import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Crosshair,
  ShieldCheck,
  Star,
  Navigation,
  ChevronRight,
  ExternalLink,
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Hammer,
  Briefcase,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { WorkerProfile } from '../../types';

export interface WorkerWithDistance extends WorkerProfile {
  distanceKm: number;
  etaMinutes: number;
  computedStatus: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
}

interface GeoapifyWorkerMapProps {
  workers: WorkerWithDistance[];
  userLocation: {
    lat: number;
    lng: number;
    source: string;
    label: string;
    accuracy?: number;
  };
  selectedWorkerId: string | null;
  onSelectWorker: (worker: WorkerWithDistance) => void;
  onBookWorker?: (trade: string, worker: WorkerProfile) => void;
  onLocateUser?: () => void;
  maxRadiusKm: number;
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

function getTradeIconSvg(trade: string) {
  const t = (trade || '').toLowerCase();
  if (t.includes('plumb')) return '🔧';
  if (t.includes('electr')) return '⚡';
  if (t.includes('clean')) return '✨';
  if (t.includes('ac') || t.includes('appliance')) return '❄️';
  if (t.includes('carp')) return '🔨';
  return '💼';
}

export function GeoapifyWorkerMap({
  workers,
  userLocation,
  selectedWorkerId,
  onSelectWorker,
  onBookWorker,
  onLocateUser,
  maxRadiusKm,
}: GeoapifyWorkerMapProps) {
  // Read configured Geoapify API key from environment or localStorage
  const envKey: string = (import.meta as any).env?.VITE_GEOAPIFY_API_KEY || '';
  const [activeKey, setActiveKey] = useState<string>(() => {
    if (envKey) return envKey;
    try {
      return localStorage.getItem('GEOAPIFY_API_KEY') || '';
    } catch {
      return '';
    }
  });

  const [inputKey, setInputKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [currentStyle, setCurrentStyle] = useState<GeoapifyStyle>('osm-bright');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Key persistence handlers
  const handleSaveKey = (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) {
      setKeyError('Please enter a valid Geoapify API Key');
      return;
    }
    try {
      localStorage.setItem('GEOAPIFY_API_KEY', trimmed);
    } catch (e) {
      console.warn('Could not store Geoapify key in localStorage', e);
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
    setInputKey('');
  };

  // Initialize or re-create Leaflet Map when activeKey changes
  useEffect(() => {
    if (!activeKey || !mapContainerRef.current) return;

    // Clean up previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Create markers layer group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Add Geoapify tile layer
    const tileUrl = `https://maps.geoapify.com/v1/tile/${currentStyle}/{z}/{x}/{y}.png?apiKey=${activeKey}`;
    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      maxZoom: 20,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeKey]);

  // Update tile layer style when currentStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !activeKey) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl = `https://maps.geoapify.com/v1/tile/${currentStyle}/{z}/{x}/{y}.png?apiKey=${activeKey}`;
    const newLayer = L.tileLayer(tileUrl, {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      maxZoom: 20,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [currentStyle, activeKey]);

  // Update User Location Marker and Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }

    // Radius circle
    const circle = L.circle([userLocation.lat, userLocation.lng], {
      radius: maxRadiusKm * 1000,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '5, 5',
    }).addTo(map);
    radiusCircleRef.current = circle;

    // User pin with pulsing radar dot
    const userDivIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 140px; margin-left: -70px; margin-top: -20px; pointer-events: auto;">
          <div style="width: 32px; height: 32px; border-radius: 9999px; background-color: #2563eb; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style="margin-top: 3px; background-color: rgba(15, 23, 42, 0.9); color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            You (${maxRadiusKm} km)
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userDivIcon,
      zIndexOffset: 1000,
    }).addTo(map);
    userMarkerRef.current = userMarker;
  }, [userLocation.lat, userLocation.lng, maxRadiusKm]);

  // Update Worker Markers and interactive Popups
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    const map = mapInstanceRef.current;
    if (!markersLayer || !map) return;

    markersLayer.clearLayers();

    workers.forEach((worker) => {
      const isSelected = worker.id === selectedWorkerId;
      const isAvailable = worker.computedStatus === 'AVAILABLE';
      const lat = worker.currentLocation?.lat ?? 22.7196;
      const lng = worker.currentLocation?.lng ?? 75.8577;
      const iconSymbol = getTradeIconSvg(worker.primaryTrade);

      const workerDivIcon = L.divIcon({
        className: 'custom-artisan-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 150px; margin-left: -75px; margin-top: -18px; cursor: pointer; user-select: none;">
            <div style="display: flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 9999px; font-family: inherit; font-size: 11px; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25); border: ${
              isSelected
                ? '2px solid #3b82f6; background-color: #2563eb; color: #ffffff;'
                : isAvailable
                ? '1.5px solid #10b981; background-color: #ffffff; color: #0f172a;'
                : '1px solid #cbd5e1; background-color: #f1f5f9; color: #64748b;'
            };">
              <span style="width: 7px; height: 7px; border-radius: 9999px; background-color: ${
                isAvailable ? '#10b981' : '#f59e0b'
              }; flex-shrink: 0;"></span>
              <span style="font-size: 11px;">${iconSymbol}</span>
              <span style="max-width: 65px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${
                worker.name.split(' ')[0]
              }</span>
              <span style="font-size: 9px; padding: 1px 4px; border-radius: 4px; font-weight: 800; background-color: ${
                isSelected ? '#1d4ed8' : '#e0f2fe'
              }; color: ${isSelected ? '#ffffff' : '#0369a1'};">
                ${worker.primaryTrade.slice(0, 5)}
              </span>
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; border-radius: 9999px; background-color: #d1fae5; color: #047857; font-size: 9px; font-weight: 900;" title="UIDAI Aadhaar Verified">
                ✓
              </span>
            </div>
            <div style="width: 8px; height: 8px; transform: rotate(45deg); margin-top: -4px; background-color: ${
              isSelected ? '#2563eb' : isAvailable ? '#ffffff' : '#f1f5f9'
            }; border-right: 1px solid ${
          isSelected ? '#2563eb' : isAvailable ? '#10b981' : '#cbd5e1'
        }; border-bottom: 1px solid ${
          isSelected ? '#2563eb' : isAvailable ? '#10b981' : '#cbd5e1'
        };"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([lat, lng], {
        icon: workerDivIcon,
        zIndexOffset: isSelected ? 500 : isAvailable ? 200 : 50,
      });

      // Rich popup content with dispatch button
      const popupHtml = `
        <div style="font-family: inherit; width: 230px; padding: 2px; color: #0f172a;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">
            <div>
              <div style="font-weight: 800; font-size: 13px; color: #0f172a; display: flex; align-items: center; gap: 4px;">
                <span>${worker.name}</span>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #2563eb; margin-top: 1px;">
                ${worker.primaryTrade}
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 1px;">
                ${worker.societyName || 'Indore Labour Cooperative'}
              </div>
            </div>
            <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background-color: ${
              isAvailable ? '#ecfdf5' : '#fef3c7'
            }; color: ${isAvailable ? '#047857' : '#b45309'}; border: 1px solid ${
        isAvailable ? '#a7f3d0' : '#fde68a'
      };">
              ${isAvailable ? 'Available' : 'Engaged'}
            </span>
          </div>

          <!-- Aadhaar UIDAI Verification Tag -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 6px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 10px;">
            <span style="color: #047857; font-weight: 700; display: flex; align-items: center; gap: 4px;">
              <span>🛡️</span> Aadhaar Verified
            </span>
            <span style="color: #64748b; font-family: monospace;">${
              worker.maskedAadhaar || 'XXXX XXXX 6821'
            }</span>
          </div>

          <!-- Distance & Rating Stats -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; margin-bottom: 8px;">
            <div style="background-color: #f8fafc; padding: 4px 6px; border-radius: 6px; color: #475569;">
              📍 <strong>${worker.distanceKm} km</strong> away
            </div>
            <div style="background-color: #f8fafc; padding: 4px 6px; border-radius: 6px; text-align: right; color: #475569;">
              ⭐ <strong>${worker.rating.toFixed(1)}</strong> (${worker.completedJobs} jobs)
            </div>
          </div>

          <!-- Dispatch Button Trigger -->
          ${
            isAvailable && onBookWorker
              ? `<button id="dispatch-btn-${worker.id}" style="width: 100%; padding: 6px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s;">
                  Direct Dispatch Request →
                </button>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('click', () => {
        onSelectWorker(worker);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`dispatch-btn-${worker.id}`);
        if (btn && onBookWorker) {
          btn.onclick = () => {
            onBookWorker(worker.primaryTrade, worker);
            marker.closePopup();
          };
        }
      });

      markersLayer.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [workers, selectedWorkerId, onSelectWorker, onBookWorker]);

  // Recenter actions
  const handleCenterOnUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14, {
        animate: true,
      });
    }
    if (onLocateUser) {
      onLocateUser();
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="w-full h-full min-h-[460px] relative flex flex-col bg-slate-900 overflow-hidden isolate">
      {/* Unified Top Map Controls Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex flex-wrap items-start justify-between gap-2">
        {/* Left Controls Group */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {/* Style Switcher */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-0.5 flex items-center text-xs">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentStyle(style.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  currentStyle === style.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Center on User Location */}
          <button
            onClick={handleCenterOnUser}
            className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-xs font-bold w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 transition-all active:scale-95"
            title={t('Recenter_on_My_Location_3c5da', `Recenter on My Location`)}
          >
            <Crosshair size={13} className="text-blue-600" />
            <span className="hidden sm:inline">{t('My_Location_5uypp', `My Location`)}</span>
          </button>

          {/* Active Artisans Counter */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md border border-slate-700/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{workers.length} {t('nearby_leap6', `nearby`)}</span>
          </div>
        </div>

        {/* Right Key Pill Group */}
        <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
          {activeKey ? (
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl shadow-md border border-slate-700/80 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-300">
                {envKey ? 'Env Key' : 'Geoapify'}
              </span>
              <button
                onClick={() => setShowKeyModal(true)}
                className="text-blue-400 hover:text-blue-300 underline font-bold ml-1"
                title={t('Change_Geoapify_Key_n6wki', `Change Geoapify Key`)}
              >
                {t('Key_byvs0', `Key`)}</button>
            </div>
          ) : (
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl shadow-md font-bold text-xs transition-all active:scale-95"
            >
              <Sparkles size={13} />
              <span>{t('Enter_Geoapify_Key_aj7yt', `Enter Geoapify Key`)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Zoom Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-white shadow-lg border border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center font-bold transition-all active:scale-95"
          title={t('Zoom_In_0avn8', `Zoom In`)}
        >
          <Plus size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-white shadow-lg border border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center font-bold transition-all active:scale-95"
          title={t('Zoom_Out_o7c0n', `Zoom Out`)}
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Geoapify Key Configuration Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                  <Sparkles size={12} />
                  <span>{t('Geoapify_Maps_Integration_kv22j', `Geoapify Maps Integration`)}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {t('Geoapify_API_Key_jpwic', `Geoapify API Key`)}</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t('Geoapify_powers_vector_and_ras_w6mos', `Geoapify powers vector and raster OpenStreetMap tiles, custom map themes, and spatial artisan dispatch.`)}</p>

            <div className="space-y-2">
              <label htmlFor="geoapify-key-input" className="text-xs font-bold text-slate-800 block">
                {t('Paste_your_Geoapify_API_Key__1jse8', `Paste your Geoapify API Key:`)}</label>
              <div className="flex gap-2">
                <input
                  id="geoapify-key-input"
                  type="text"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setKeyError('');
                  }}
                  placeholder={t('e_g__4a2b8f9e____xsys5', `e.g. 4a2b8f9e...`)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveKey(inputKey)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  {t('Activate_mpz9b', `Activate`)}</button>
              </div>
              {keyError && (
                <p className="text-[11px] font-semibold text-rose-600">{keyError}</p>
              )}
            </div>

            {/* Active Key Status */}
            {activeKey && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {t('Active__zemkt', `Active:`)}{' '}
                  <code className="font-mono">
                    {activeKey.slice(0, 6)}{t('____zystz', `...`)}{activeKey.slice(-4)}
                  </code>
                </span>
                <button
                  onClick={handleClearKey}
                  className="text-rose-600 hover:text-rose-700 font-semibold text-[11px]"
                >
                  {t('Remove_Key_b2zxv', `Remove Key`)}</button>
              </div>
            )}

            <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{t('Need_a_key_or_project_dashboar_7c2nw', `Need a key or project dashboard?`)}</span>
              <a
                href="https://myprojects.geoapify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <span>{t('Geoapify_Projects_xyakk', `Geoapify Projects`)}</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Map Canvas or Prompt Card */}
      {activeKey ? (
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[460px] flex-1 z-0"
        />
      ) : (
        /* Prompt Screen for Geoapify Key */
        <div className="w-full h-full min-h-[460px] flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shadow-inner">
              <MapPin size={28} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/20">
                <Sparkles size={13} />
                <span>{t('Geoapify_Maps_Integration_vgrvt', `Geoapify Maps Integration`)}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {t('Connect_Your_Geoapify_Key_qm1rx', `Connect Your Geoapify Key`)}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('Paste_your_Geoapify_API_key_be_77l2x', `Paste your Geoapify API key below to unlock real-time map cartography, artisan GPS markers, and spatial dispatch zones.`)}</p>
            </div>

            {/* Direct Inline Key Input */}
            <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/10 space-y-2.5 text-left">
              <label
                htmlFor="zero-geoapify-key"
                className="text-xs font-bold text-slate-200 block"
              >
                {t('Paste_your_Geoapify_API_Key__pvhqw', `Paste your Geoapify API Key:`)}</label>
              <div className="flex gap-2">
                <input
                  id="zero-geoapify-key"
                  type="text"
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
                  placeholder={t('Paste_your_Geoapify_API_key_he_fkpgn', `Paste your Geoapify API key here`)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-slate-950/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveKey(inputKey)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1"
                >
                  <span>{t('Activate_3qodl', `Activate`)}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
              {keyError && (
                <p className="text-[11px] font-semibold text-rose-400">
                  {keyError}
                </p>
              )}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <span>{t('Don_t_have_a_key_yet__dxg9j', `Don't have a key yet?`)}</span>
              <a
                href="https://myprojects.geoapify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <span>{t('Get_one_from_Geoapify_Projects_5492e', `Get one from Geoapify Projects`)}</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
