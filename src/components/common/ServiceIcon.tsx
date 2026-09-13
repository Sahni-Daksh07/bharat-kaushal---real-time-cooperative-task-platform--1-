import React from 'react';
import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Paintbrush,
  Tv,
  Bug,
  Trees,
  Scissors,
  Building,
  Key,
  Car,
  Package,
  ShieldCheck,
} from 'lucide-react';

interface ServiceIconProps {
  category: string;
  className?: string;
  size?: number;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ category, className = '', size = 20 }) => {
  const cat = (category || '').toLowerCase();

  if (cat.includes('plumb')) {
    return <Wrench size={size} className={`text-blue-600 ${className}`} />;
  }
  if (cat.includes('elect')) {
    return <Zap size={size} className={`text-amber-500 ${className}`} />;
  }
  if (cat.includes('carpent')) {
    return <Hammer size={size} className={`text-amber-700 ${className}`} />;
  }
  if (cat.includes('clean')) {
    return <Sparkles size={size} className={`text-cyan-600 ${className}`} />;
  }
  if (cat.includes('paint')) {
    return <Paintbrush size={size} className={`text-purple-600 ${className}`} />;
  }
  if (cat.includes('appliance') || cat.includes('ac') || cat.includes('tv') || cat.includes('refrig')) {
    return <Tv size={size} className={`text-indigo-600 ${className}`} />;
  }
  if (cat.includes('pest')) {
    return <Bug size={size} className={`text-emerald-700 ${className}`} />;
  }
  if (cat.includes('garden')) {
    return <Trees size={size} className={`text-green-600 ${className}`} />;
  }
  if (cat.includes('beauty') || cat.includes('salon')) {
    return <Scissors size={size} className={`text-pink-600 ${className}`} />;
  }
  if (cat.includes('mason') || cat.includes('civil') || cat.includes('construct')) {
    return <Building size={size} className={`text-slate-700 ${className}`} />;
  }
  if (cat.includes('lock')) {
    return <Key size={size} className={`text-yellow-600 ${className}`} />;
  }
  if (cat.includes('driver')) {
    return <Car size={size} className={`text-blue-700 ${className}`} />;
  }
  if (cat.includes('moving') || cat.includes('pack')) {
    return <Package size={size} className={`text-orange-600 ${className}`} />;
  }

  return <ShieldCheck size={size} className={`text-blue-600 ${className}`} />;
};
