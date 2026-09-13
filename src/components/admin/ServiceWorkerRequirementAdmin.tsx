import React, { useState } from 'react';
import {
  Users,
  Sliders,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Layers,
  Search,
  Building2,
  Edit3,
} from 'lucide-react';
import { ServiceItem, WorkerRequirementType, ServicePricingModel } from '../../types';
import { useRealtime } from '../../context/RealtimeContext';

export const ServiceWorkerRequirementAdmin: React.FC = () => {
  const { services, updateService } = useRealtime();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const filteredServices = services.filter((s) => {
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchSearch =
      s.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.record_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleEdit = (service: ServiceItem) => {
    setEditingService(JSON.parse(JSON.stringify(service)));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!editingService) return;
    setIsSaving(true);
    try {
      await updateService(editingService.record_id, {
        minimum_workers: Number(editingService.minimum_workers || 1),
        recommended_workers: Number(editingService.recommended_workers || 1),
        worker_requirement_type: editingService.worker_requirement_type || 'SINGLE_WORKER',
        pricing_model: editingService.pricing_model || 'PER_JOB',
        team_roles: editingService.team_roles || ['Certified Artisan'],
        worker_requirement_rules: editingService.worker_requirement_rules || [],
        notes: editingService.notes,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingService(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to update service policy', err);
    } finally {
      setIsSaving(false);
    }
  };

  const addTeamRole = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      team_roles: [...(editingService.team_roles || []), 'Artisan Assistant'],
    });
  };

  const removeTeamRole = (idx: number) => {
    if (!editingService || !editingService.team_roles) return;
    const next = [...editingService.team_roles];
    next.splice(idx, 1);
    setEditingService({
      ...editingService,
      team_roles: next,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Dynamic Worker Requirement & Cooperative Crew Policy Configurator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure single-worker, conditional scope-based, and compulsory multi-worker crew requirements for all 140+ benchmarked trades.
          </p>
        </div>
        <div className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto">
          {services.length} Registered Services
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search service name, code, or trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Trade Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Service Code & Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Requirement Type</th>
              <th className="py-2.5 px-3">Min / Rec Crew</th>
              <th className="py-2.5 px-3">Pricing Model</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredServices.slice(0, 15).map((service) => {
              const reqType = service.worker_requirement_type || 'SINGLE_WORKER';
              return (
                <tr key={service.record_id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{service.service_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{service.record_id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-700">{service.category}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        reqType === 'SINGLE_WORKER'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : reqType === 'MULTI_WORKER_CONDITIONAL'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {reqType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Min: {service.minimum_workers || 1} / Rec: {service.recommended_workers || 1}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    {service.pricing_model || 'PER_JOB'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleEdit(service)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 size={12} />
                      <span>Configure</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Configure Worker Requirement Policy
                </h4>
                <div className="text-xs text-blue-600 font-semibold mt-0.5">
                  {editingService.service_name} ({editingService.record_id})
                </div>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Requirement Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Worker Requirement Type</label>
                <select
                  value={editingService.worker_requirement_type || 'SINGLE_WORKER'}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      worker_requirement_type: e.target.value as WorkerRequirementType,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                >
                  <option value="SINGLE_WORKER">SINGLE_WORKER (Exactly 1 artisan default)</option>
                  <option value="MULTI_WORKER_CONDITIONAL">MULTI_WORKER_CONDITIONAL (Scope-based dynamically)</option>
                  <option value="MULTI_WORKER_COMPULSORY">MULTI_WORKER_COMPULSORY (Compulsory team for safety)</option>
                </select>
              </div>

              {/* Minimum and Recommended Workers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Workers</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingService.minimum_workers || 1}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        minimum_workers: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recommended Workers</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingService.recommended_workers || 1}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        recommended_workers: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Pricing Model */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Pricing Model</label>
                <select
                  value={editingService.pricing_model || 'PER_JOB'}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      pricing_model: e.target.value as ServicePricingModel,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                >
                  <option value="PER_JOB">PER_JOB (Fixed benchmark job cost regardless of workers)</option>
                  <option value="PER_WORKER">PER_WORKER (Price multiplied per assigned worker)</option>
                  <option value="PER_DAY_PER_WORKER">PER_DAY_PER_WORKER (Daily wage per artisan)</option>
                  <option value="PER_UNIT">PER_UNIT (Per appliance/unit rate)</option>
                  <option value="PER_SQFT">PER_SQFT (Per square foot rate)</option>
                </select>
              </div>

              {/* Team Roles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Team Crew Roles</label>
                  <button
                    type="button"
                    onClick={addTeamRole}
                    className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Role</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(editingService.team_roles || ['Lead Craftsman']).map((role, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-center font-bold text-slate-400">{idx + 1}.</span>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => {
                          const next = [...(editingService.team_roles || [])];
                          next[idx] = e.target.value;
                          setEditingService({ ...editingService, team_roles: next });
                        }}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                      />
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeTeamRole(idx)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {isSaving ? (
                  <span>Saving Policy...</span>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Policy Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
