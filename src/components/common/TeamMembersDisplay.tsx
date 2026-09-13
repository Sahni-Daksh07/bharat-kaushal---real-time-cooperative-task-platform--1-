import React from 'react';
import { Users, Phone, ShieldCheck, Star, Award, CheckCircle } from 'lucide-react';
import { BookingWorker, Booking } from '../../types';

interface TeamMembersDisplayProps {
  booking: Booking;
  title?: string;
  variant?: 'compact' | 'full';
}

export const TeamMembersDisplay: React.FC<TeamMembersDisplayProps> = ({
  booking,
  title = 'Cooperative Artisan Crew',
  variant = 'full',
}) => {
  const team: BookingWorker[] =
    booking.teamMembers && booking.teamMembers.length > 0
      ? booking.teamMembers
      : [
          {
            id: booking.workerId || 'BH-WKR-DEMO',
            workerName: booking.workerName || 'Assigned Artisan',
            role: 'Lead Master Craftsman',
            phone: booking.workerPhone || '9826012345',
            trade: booking.workerTrade || booking.category,
            rating: booking.workerRating || 4.9,
            trustScore: booking.workerTrustScore || 95,
            isLead: true,
            status: 'ASSIGNED',
            assignedAt: new Date().toISOString(),
          },
        ];

  return (
    <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-3.5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-blue-600" />
          <span className="font-bold text-slate-900 text-xs sm:text-sm">{title}</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
            {team.length} Member{team.length > 1 ? 's' : ''}
          </span>
        </div>
        {booking.workerRequirementType && (
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            {booking.workerRequirementType.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {team.map((worker, idx) => (
          <div
            key={worker.id || idx}
            className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
              worker.isLead
                ? 'bg-white border-blue-300 shadow-2xs'
                : 'bg-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                    worker.isLead
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {worker.workerName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>{worker.workerName}</span>
                    {worker.isLead && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                        LEAD
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {worker.role || (worker.isLead ? 'Lead Technician' : 'Artisan Assistant')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs shrink-0">
                <Star size={12} fill="#F59E0B" />
                <span>{worker.rating?.toFixed(1) || '4.9'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100 text-slate-600">
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck size={12} />
                <span>Trust: {worker.trustScore || 95}/100</span>
              </div>
              <a
                href={`tel:${worker.phone}`}
                className="flex items-center gap-1 text-blue-700 font-bold hover:underline"
              >
                <Phone size={11} />
                <span>+91 {worker.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
