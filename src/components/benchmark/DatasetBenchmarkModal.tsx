import React, { useState, useMemo } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { INDORE_SERVICES_DATASET, getDatasetSummary } from '../../data/servicesData';
import { ServiceIcon } from '../common/ServiceIcon';
import { UserRole } from '../../types';
import {
  X,
  Search,
  Download,
  Database,
  ArrowUpDown,
  Play,
  TrendingUp,
} from 'lucide-react';

interface DatasetBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceToBook?: (serviceId: string) => void;
  currentRole?: UserRole;
}

export const DatasetBenchmarkModal: React.FC<DatasetBenchmarkModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceToBook,
  currentRole,
}) => {
  const { policy, createBooking } = useRealtime();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'name' | 'price' | 'demand'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  const stats = useMemo(() => getDatasetSummary(), []);

  const categories = useMemo(() => {
    const set = new Set(INDORE_SERVICES_DATASET.map((s) => s.category));
    return ['ALL', ...Array.from(set).sort()];
  }, []);

  const filteredServices = useMemo(() => {
    return INDORE_SERVICES_DATASET.filter((s) => {
      const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
      const matchQuery =
        s.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchQuery;
    }).sort((a, b) => {
      let diff = 0;
      if (sortField === 'name') diff = a.service_name.localeCompare(b.service_name);
      if (sortField === 'price') diff = a.suggested_display_price_inr - b.suggested_display_price_inr;
      if (sortField === 'demand') {
        const order = { High: 3, Medium: 2, Low: 1 };
        diff = (order[b.typical_demand as keyof typeof order] || 0) - (order[a.typical_demand as keyof typeof order] || 0);
      }
      return sortAsc ? diff : -diff;
    });
  }, [selectedCategory, searchTerm, sortField, sortAsc]);

  const handleTestBook = async (serviceId: string) => {
    if (onSelectServiceToBook) {
      onSelectServiceToBook(serviceId);
      onClose();
    } else {
      const booking = await createBooking(serviceId);
      setBookedSuccess(`Test Booking ${booking.id} created successfully!`);
      setTimeout(() => setBookedSuccess(null), 4000);
    }
  };

  const isAuthorizedRole = !currentRole || ['SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'].includes(currentRole);

  if (!isOpen || !isAuthorizedRole) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Database size={22} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold">{t('Indore_Local_Services_Demo_Pri_t8mfg', `Indore Local Services Demo Pricing Dataset`)}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {t('140_Verified_Records_2ljp4', `140 Verified Records`)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('Authentic_trade_rate_benchmark_kb1fu', `Authentic trade rate benchmarks collected for Indore Municipal Corporation (IMC) territory. Used for automated dispatch and fair revenue splitting.`)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Benchmark Metrics Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500">{t('Catalog_Size_qwebk', `Catalog Size`)}</div>
            <div className="text-lg font-black text-slate-900">{stats.totalRecords} {t('Services_1obx7', `Services`)}</div>
            <div className="text-[11px] text-blue-600">{stats.categoriesCount} {t('Trade_Categories_6yfsz', `Trade Categories`)}</div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500">{t('Average_Rate_7mo2w', `Average Rate`)}</div>
            <div className="text-lg font-black text-slate-900">₹{Math.round(((stats as any).avgPrice || (stats.minRate + stats.maxRate) / 2))}</div>
            <div className="text-[11px] text-slate-500">{t('Range____h45gc', `Range: ₹`)}{(stats as any).minPrice ?? stats.minRate} {t('____5rwts', `– ₹`)}{(stats as any).maxPrice ?? stats.maxRate}</div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500">{t('Active_Revenue_Model_1rn9a', `Active Revenue Model`)}</div>
            <div className="text-lg font-black text-emerald-600">
              {policy.activeModel === 'MODEL_A' ? '94.5% Worker' : '95.0% Worker'}
            </div>
            <div className="text-[11px] text-slate-500">
              {policy.activeModel === 'MODEL_A' ? '3.5% Society | 2.0% Welfare' : '2.5% Society | 2.5% Welfare'}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-slate-500">{t('Raw_Dataset_CSV_7t5ss', `Raw Dataset CSV`)}</div>
              <div className="text-xs font-bold text-slate-800">{t('140_rows__13_fields_pz6hh', `140 rows, 13 fields`)}</div>
            </div>
            <a
              href="/indore_local_home_services_dataset.csv"
              download="indore_local_home_services_dataset.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download size={13} />
              <span>{t('Export_CSV_i1o5g', `Export CSV`)}</span>
            </a>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('Search_by_trade__service_name__lp7bj', `Search by trade, service name, or keywords (e.g. tap, ac, switchboard, sofa)...`)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Trade Categories' : c}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (sortField === 'price') setSortAsc(!sortAsc);
                else {
                  setSortField('price');
                  setSortAsc(true);
                }
              }}
              className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg border font-medium ${
                sortField === 'price' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <ArrowUpDown size={12} />
              <span>{t('Sort_Price_vu7e0', `Sort Price`)}{sortField === 'price' ? (sortAsc ? '↑' : '↓') : ''}</span>
            </button>
          </div>
        </div>

        {/* Success Notice if booked */}
        {bookedSuccess && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 mx-4 mt-3 text-xs text-emerald-800 flex items-center justify-between">
            <span>{bookedSuccess} {t('Check_the_Customer_and_Worker__zdh7x', `Check the Customer and Worker tabs to test the live WebSocket flow!`)}</span>
            <button onClick={() => setBookedSuccess(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">
              {t('Dismiss_n7jb7', `Dismiss`)}</button>
          </div>
        )}

        {/* Dataset Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <th className="p-2.5">{t('ID_thxuz', `ID`)}</th>
                <th className="p-2.5">{t('Trade___Service_Name_r75w0', `Trade & Service Name`)}</th>
                <th className="p-2.5">{t('Unit___Time_nnqlj', `Unit / Time`)}</th>
                <th className="p-2.5">{t('Market_Range__Min___Max__wbuvr', `Market Range (Min - Max)`)}</th>
                <th className="p-2.5">{t('Suggested_Benchmark_dkmth', `Suggested Benchmark`)}</th>
                <th className="p-2.5">{t('Worker_Share___p5xm2', `Worker Share (`)}{policy.activeModel === 'MODEL_A' ? '94.5%' : '95.0%'})</th>
                <th className="p-2.5">{t('Demand_Level_38mnu', `Demand Level`)}</th>
                <th className="p-2.5 text-center">{t('Test_Action_ag85j', `Test Action`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredServices.map((item) => {
                const workerCut = Math.round(
                  (item.suggested_display_price_inr *
                    (policy.activeModel === 'MODEL_A' ? policy.modelA.workerSharePercent : policy.modelB.workerSharePercent)) /
                    100
                );
                return (
                  <tr key={item.record_id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-2.5 font-mono text-[11px] text-slate-500">{item.record_id}</td>
                    <td className="p-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <ServiceIcon category={item.category} size={16} />
                        <div>
                          <div className="font-semibold text-slate-900">{item.service_name}</div>
                          <div className="text-[10px] text-slate-500">{item.category} • {item.notes}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {item.pricing_unit} ({item.estimated_duration_hours}{t('h__tj0dj', `h)`)}</span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      ₹{item.min_price_inr} {t('____547yt', `- ₹`)}{item.max_price_inr}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900 text-sm">
                      ₹{item.suggested_display_price_inr}
                    </td>
                    <td className="p-2.5 font-semibold text-emerald-700">
                      ₹{workerCut}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit ${
                          item.typical_demand === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : item.typical_demand === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <TrendingUp size={10} />
                        {item.typical_demand}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleTestBook(item.record_id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors shadow-2xs"
                        title={t('Dispatch_test_booking_for_this_l6nag', `Dispatch test booking for this service record`)}
                      >
                        <Play size={11} />
                        <span>{t('Test_Book_vokq1', `Test Book`)}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredServices.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              {t('No_services_found_matching_que_655n9', `No services found matching query &ldquo;`)}{searchTerm}{t('_rdquo___Try_another_keyword__u9204', `&rdquo;. Try another keyword.`)}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>{t('Showing_6rpy7', `Showing`)}{filteredServices.length} {t('of_140_Indore_services_zaz71', `of 140 Indore services`)}</span>
          <span className="text-[11px] text-slate-500">
            {t('Cooperative_Labour_Policy__Wor_csevp', `Cooperative Labour Policy: Worker receives 94.5% to 95.0% directly with zero hidden platform cut.`)}</span>
        </div>
      </div>
    </div>
  );
};
