import React, { useState } from 'react';
import {
  Wrench,
  IndianRupee,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  baseRateInr: number;
  ceilingRateInr: number;
  workerEarningInr: number;
  societyMarginInr: number;
  welfareCorpusInr: number;
  activeWorkers: number;
  status: 'ACTIVE' | 'REVIEW';
}

const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'SRV-PLM-01',
    name: 'Standard Plumbing Pipe Leak Repair',
    category: 'Plumbing',
    baseRateInr: 299,
    ceilingRateInr: 499,
    workerEarningInr: 282.5,
    societyMarginInr: 10.5,
    welfareCorpusInr: 6.0,
    activeWorkers: 4210,
    status: 'ACTIVE',
  },
  {
    id: 'SRV-PLM-02',
    name: 'Complete Bathroom Sanitary Fitting Installation',
    category: 'Plumbing',
    baseRateInr: 799,
    ceilingRateInr: 1499,
    workerEarningInr: 755.0,
    societyMarginInr: 28.0,
    welfareCorpusInr: 16.0,
    activeWorkers: 3120,
    status: 'ACTIVE',
  },
  {
    id: 'SRV-ELC-01',
    name: 'Electrical Short Circuit Diagnostics & Rectification',
    category: 'Electrical',
    baseRateInr: 349,
    ceilingRateInr: 599,
    workerEarningInr: 329.8,
    societyMarginInr: 12.2,
    welfareCorpusInr: 7.0,
    activeWorkers: 5120,
    status: 'ACTIVE',
  },
  {
    id: 'SRV-ELC-02',
    name: 'Distribution Board (MCB) Overhaul & Safety Inspection',
    category: 'Electrical',
    baseRateInr: 599,
    ceilingRateInr: 999,
    workerEarningInr: 566.0,
    societyMarginInr: 21.0,
    welfareCorpusInr: 12.0,
    activeWorkers: 3940,
    status: 'ACTIVE',
  },
  {
    id: 'SRV-SOL-01',
    name: 'Rooftop Solar Inverter & Grid-Tie Preventive Maintenance',
    category: 'Solar',
    baseRateInr: 899,
    ceilingRateInr: 1499,
    workerEarningInr: 849.5,
    societyMarginInr: 31.5,
    welfareCorpusInr: 18.0,
    activeWorkers: 1240,
    status: 'ACTIVE',
  },
  {
    id: 'SRV-HVA-01',
    name: 'Air Conditioner Jet Pump Deep Service & Gas Top-up',
    category: 'HVAC',
    baseRateInr: 649,
    ceilingRateInr: 1199,
    workerEarningInr: 613.3,
    societyMarginInr: 22.7,
    welfareCorpusInr: 13.0,
    activeWorkers: 2890,
    status: 'ACTIVE',
  },
  {
    id: 'SRV-CRP-01',
    name: 'Modular Furniture Hinge & Hydraulic Channel Repair',
    category: 'Carpentry',
    baseRateInr: 399,
    ceilingRateInr: 699,
    workerEarningInr: 377.0,
    societyMarginInr: 14.0,
    welfareCorpusInr: 8.0,
    activeWorkers: 1980,
    status: 'ACTIVE',
  },
];

export const ServicesDirectoryView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = SERVICES_CATALOG.filter((s) => {
    const matchCat = selectedCat === 'ALL' || s.category === selectedCat;
    const matchSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Wrench size={16} className="text-blue-600" />
            <span>{t('National_Trade_Directory___Fai_00vt9', `National Trade Directory & Fair Price Benchmarks`)}</span>
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            {t('Fair_Rate_Ceiling_Protection_A_odvvr', `Fair Rate Ceiling Protection Active`)}</span>
        </div>
        <p className="text-xs text-slate-500">
          {t('Statutory_price_ranges_prevent_sjumx', `Statutory price ranges prevent predatory surge pricing while ensuring guaranteed 94.5% base pay to workers and automatic 2% welfare allocations.`)}</p>
      </div>

      {/* Filter and Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            >
              <option value="ALL">{t('All_Trade_Sectors_hvzkj', `All Trade Sectors`)}</option>
              <option value="Plumbing">{t('Plumbing_5tfkg', `Plumbing`)}</option>
              <option value="Electrical">{t('Electrical_zklpt', `Electrical`)}</option>
              <option value="Solar">{t('Solar_Technology_tig70', `Solar Technology`)}</option>
              <option value="HVAC">{t('HVAC___Appliances_co34d', `HVAC & Appliances`)}</option>
              <option value="Carpentry">{t('Carpentry_xivy7', `Carpentry`)}</option>
            </select>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('Search_trade_or_job____8pj2k', `Search trade or job...`)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">{t('Service___Code_go32b', `Service & Code`)}</th>
                <th className="py-2.5 px-3">{t('Category_595dm', `Category`)}</th>
                <th className="py-2.5 px-3">{t('Consumer_Fair_Band_ovp21', `Consumer Fair Band`)}</th>
                <th className="py-2.5 px-3">{t('Artisan__94_5___prg7b', `Artisan (94.5%)`)}</th>
                <th className="py-2.5 px-3">{t('Society__3_5___8d865', `Society (3.5%)`)}</th>
                <th className="py-2.5 px-3">{t('Welfare__2_0___d8b0z', `Welfare (2.0%)`)}</th>
                <th className="py-2.5 px-3">{t('Certified_Active_y6utw', `Certified Active`)}</th>
                <th className="py-2.5 px-3">{t('Status_mlcs4', `Status`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{s.id}</div>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">{s.category}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    ₹{s.baseRateInr} {t('____z0qgd', `- ₹`)}{s.ceilingRateInr}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">₹{s.workerEarningInr}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">₹{s.societyMarginInr}</td>
                  <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">₹{s.welfareCorpusInr}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 font-semibold">
                    {s.activeWorkers.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
