import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  Info,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Maximize2,
  Bug,
  ChevronDown,
} from 'lucide-react';
import {
  ServiceItem,
  BookingScopeDetails,
  WorkerRequirementResult,
  CooperativePolicy,
} from '../../types';
import {
  calculateWorkerRequirement,
  calculateServiceBookingPricing,
} from '../../utils/workerRequirementEngine';

interface DynamicWorkerScopeConfigProps {
  service: ServiceItem;
  policy: CooperativePolicy;
  onScopeChange: (scope: BookingScopeDetails, result: WorkerRequirementResult, pricing: any) => void;
  unavailableTeamError?: {
    isTeamUnavailable: boolean;
    minRequired: number;
    selectedWorkers: number;
    availableCount: number;
    missingCount: number;
    alternativeSlots: string[];
  } | null;
  onSelectAlternativeSlot?: (slot: string) => void;
}

export const DynamicWorkerScopeConfig: React.FC<DynamicWorkerScopeConfigProps> = ({
  service,
  policy,
  onScopeChange,
  unavailableTeamError,
  onSelectAlternativeSlot,
}) => {
  const [propertyType, setPropertyType] = useState<string>('2BHK');
  const [areaSqFt, setAreaSqFt] = useState<number>(1000);
  const [treatmentType, setTreatmentType] = useState<string>(
    service.category.toLowerCase().includes('pest') ? 'Cockroach & Ant Gel' : ''
  );
  const [unitCount, setUnitCount] = useState<number>(1);
  const [isPostConstruction, setIsPostConstruction] = useState<boolean>(false);
  const [selectedWorkerCount, setSelectedWorkerCount] = useState<number | undefined>(undefined);
  const [customNotes, setCustomNotes] = useState<string>('');

  const isPestControl = service.category.toLowerCase().includes('pest');
  const isCleaning = service.category.toLowerCase().includes('cleaning');
  const isAC = service.category.toLowerCase().includes('ac') || service.service_name.toLowerCase().includes('ac');
  const isSolarOrHeavy =
    service.category.toLowerCase().includes('solar') ||
    service.service_name.toLowerCase().includes('solar') ||
    service.service_name.toLowerCase().includes('waterproofing') ||
    service.service_name.toLowerCase().includes('gate fabrication') ||
    service.service_name.toLowerCase().includes('marble');

  // Build Scope Object
  const scopeDetails: BookingScopeDetails = useMemo(() => {
    return {
      propertyType: propertyType as any,
      areaSqFt,
      treatmentType: isPestControl ? treatmentType : undefined,
      unitCount: isAC ? unitCount : undefined,
      isPostConstruction,
      selectedWorkerCount,
      customNotes,
    };
  }, [propertyType, areaSqFt, treatmentType, unitCount, isPostConstruction, selectedWorkerCount, customNotes, isPestControl, isAC]);

  // Compute dynamic worker requirements
  const reqResult = useMemo(() => {
    return calculateWorkerRequirement(service, scopeDetails);
  }, [service, scopeDetails]);

  // Compute dynamic pricing
  const pricing = useMemo(() => {
    return calculateServiceBookingPricing(service, reqResult, scopeDetails, policy);
  }, [service, reqResult, scopeDetails, policy]);

  // Notify parent of updates
  useEffect(() => {
    onScopeChange(scopeDetails, reqResult, pricing);
  }, [scopeDetails, reqResult, pricing, onScopeChange]);

  const reqTypeBadge = useMemo(() => {
    switch (reqResult.worker_requirement_type) {
      case 'SINGLE_WORKER':
        return {
          label: 'Single Artisan Service',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          desc: 'This service is designed and optimized for a single certified master artisan.',
        };
      case 'MULTI_WORKER_CONDITIONAL':
        return {
          label: 'Scope-Dependent Team (1–3 Artisans)',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
          desc: 'Team size automatically adjusts based on property dimensions, chemical handling, or job complexity.',
        };
      case 'MULTI_WORKER_COMPULSORY':
        return {
          label: `Compulsory Multi-Artisan Crew (Min ${reqResult.minimum_workers} Artisans)`,
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
          desc: 'For occupational safety, heavy lifting, and electrical compliance, a multi-worker crew is strictly mandatory.',
        };
    }
  }, [reqResult]);

  return (
    <div className="space-y-4 text-xs">
      {/* Requirement Type Badge & Rule Summary */}
      <div className={`p-3.5 rounded-2xl border ${reqTypeBadge.badgeClass} space-y-2`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            <Users size={16} className="shrink-0" />
            <span>{reqTypeBadge.label}</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-current shadow-2xs">
            {reqResult.selected_workers} Artisan{reqResult.selected_workers > 1 ? 's' : ''} Assigned
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
          {reqResult.reason || reqTypeBadge.desc}
        </p>

        {reqResult.scope_breakdown && (
          <div className="bg-white/80 rounded-xl p-2 border border-slate-200/80 text-[11px] flex items-center gap-1.5 text-slate-700">
            <Sparkles size={13} className="text-blue-600 shrink-0" />
            <span>
              <strong>Scope Evaluation:</strong> {reqResult.scope_breakdown}
            </span>
          </div>
        )}
      </div>

      {/* Scope Customization Form (Property, Area, Units) */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-3.5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 size={14} className="text-blue-600" />
            <span>Job Scope & Property Dimensions</span>
          </span>
          <span className="text-[10px] text-slate-500">Fine-tunes artisan crew requirement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Property Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                // Adjust default area accordingly
                if (e.target.value === '1RK / 1BHK') setAreaSqFt(550);
                else if (e.target.value === '2BHK') setAreaSqFt(950);
                else if (e.target.value === '3BHK') setAreaSqFt(1400);
                else if (e.target.value === '4BHK+') setAreaSqFt(2000);
                else if (e.target.value === 'Villa / Independent House') setAreaSqFt(2600);
                else if (e.target.value === 'Commercial / Office') setAreaSqFt(1800);
                else if (e.target.value === 'Warehouse / Industrial') setAreaSqFt(3500);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="1RK / 1BHK">1RK / 1BHK (Up to 600 sq ft)</option>
              <option value="2BHK">2BHK (600 - 1100 sq ft)</option>
              <option value="3BHK">3BHK (1200 - 1600 sq ft)</option>
              <option value="4BHK+">4BHK+ (1600 - 2400 sq ft)</option>
              <option value="Villa / Independent House">Villa / Independent House (2500+ sq ft)</option>
              <option value="Commercial / Office">Commercial / Office Premises</option>
              <option value="Warehouse / Industrial">Warehouse / Industrial Unit</option>
            </select>
          </div>

          {/* Approximate Area Sq Ft */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Estimated Area</label>
              <span className="font-bold text-blue-700">{areaSqFt} sq ft</span>
            </div>
            <input
              type="range"
              min="200"
              max="4000"
              step="50"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>200 sq ft</span>
              <span>1200 (Multi-worker threshold)</span>
              <span>4000+ sq ft</span>
            </div>
          </div>
        </div>

        {/* Specialized Fields based on trade */}
        {isPestControl && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Treatment Type / Chemical Scope</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Cockroach & Ant Gel', name: 'Cockroach Gel (Odorless)', minWorkers: 1 },
                { id: 'Bed Bug Eradication', name: 'Bed Bug 2-Session Spray', minWorkers: 1 },
                { id: 'Termite Drill Barrier', name: 'Termite Drill & Chemical Injection', minWorkers: 2 },
                { id: 'Mosquito Fogging', name: 'Premises Mosquito Fogging', minWorkers: 2 },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTreatmentType(t.id)}
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    treatmentType === t.id
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] leading-tight">{t.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-normal">
                    <Users size={10} /> Req: {t.minWorkers} worker{t.minWorkers > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isAC && (
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
            <div>
              <span className="font-semibold text-slate-800 block">Number of AC Units</span>
              <span className="text-[10px] text-slate-500">Includes outdoor compressor rigging</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUnitCount(Math.max(1, unitCount - 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center justify-center"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-6 text-center">{unitCount}</span>
              <button
                type="button"
                onClick={() => setUnitCount(unitCount + 1)}
                className="w-7 h-7 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Post-construction toggle */}
        {(isCleaning || isSolarOrHeavy) && (
          <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isPostConstruction}
              onChange={(e) => setIsPostConstruction(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <div>
              <span className="font-semibold text-slate-800 block">Post-Construction / Heavy Debris Site</span>
              <span className="text-[10px] text-slate-500">Requires multi-person heavy material handling</span>
            </div>
          </label>
        )}
      </div>

      {/* Team Selection Options for Conditional Multi-Worker */}
      {reqResult.worker_requirement_type === 'MULTI_WORKER_CONDITIONAL' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Users size={14} className="text-blue-600" />
              <span>Select Cooperative Crew Size</span>
            </span>
            <span className="text-[10px] text-blue-700 font-semibold">
              Recommended: {reqResult.recommended_workers} Artisans
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[1, 2, 3].map((count) => {
              const isAllowed = count >= reqResult.minimum_workers;
              const isSelected = reqResult.selected_workers === count;
              const isRecommended = count === reqResult.recommended_workers;

              return (
                <button
                  type="button"
                  key={count}
                  disabled={!isAllowed}
                  onClick={() => setSelectedWorkerCount(count)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    !isAllowed
                      ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50/90 font-bold text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{count} Artisan{count > 1 ? 's' : ''}</span>
                    {isSelected && <CheckCircle2 size={13} className="text-blue-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {isRecommended ? '⭐ Recommended' : count === 1 ? 'Standard rate' : 'Fast completion'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Roles Preview */}
      {reqResult.selected_workers > 1 && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Assigned Cooperative Team Structure ({reqResult.selected_workers} Artisans)</span>
          </span>
          <div className="space-y-1.5">
            {reqResult.team_roles.map((role, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{role}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {idx === 0 ? 'Lead Verified' : 'Cooperative Artisan'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Transparent Pricing Breakdown */}
      <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-baseline justify-between border-b border-slate-700 pb-2">
          <div>
            <span className="text-[11px] text-slate-300 font-medium">Calculated Payable Amount</span>
            <div className="text-xl font-black text-white">₹{pricing.grossAmount}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400">Pricing Model</span>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              {reqResult.pricing_model.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span>Direct Worker Share (94.5%):</span>
            <span className="font-bold text-emerald-400">₹{pricing.workerShare}</span>
          </div>
          <div className="flex justify-between">
            <span>Society Operations (3.5%):</span>
            <span className="font-bold text-blue-300">₹{pricing.societyShare}</span>
          </div>
          <div className="flex justify-between">
            <span>Social Welfare Fund (2.0%):</span>
            <span className="font-bold text-amber-300">₹{pricing.welfareShare}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Artisans:</span>
            <span className="font-bold text-white">{reqResult.selected_workers} Member{reqResult.selected_workers > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Unavailable Team Error State with Polite Alternative Slots */}
      {unavailableTeamError && unavailableTeamError.isTeamUnavailable && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-2.5 text-amber-900 font-bold text-xs sm:text-sm">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span>Full Certified Cooperative Crew Unavailable Right Now</span>
              <p className="text-xs font-normal text-amber-800 mt-1">
                This compulsory service requires a minimum verified team of{' '}
                <strong>{unavailableTeamError.minRequired} artisans</strong>. All matching certified artisans
                are currently engaged on active jobs in Indore.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-amber-200">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              <Calendar size={13} />
              <span>Recommended Alternative Available Time Slots:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {unavailableTeamError.alternativeSlots.map((slot, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onSelectAlternativeSlot?.(slot)}
                  className="p-2 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-xl text-amber-900 font-bold text-[11px] text-center transition-colors shadow-2xs"
                >
                  <Clock size={11} className="inline mr-1 text-amber-600" />
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
