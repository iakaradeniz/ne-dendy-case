import React from 'react';
import { Users, Star, BrainCircuit, ShieldAlert, Filter } from 'lucide-react';

export default function MetricCards({ count, metrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mb-2"><Users size={20} /></div>
        <p className="text-xs text-slate-500 font-medium">Katılım</p>
        <p className="text-xl font-bold">{count}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mb-2"><Star size={20} /></div>
        <p className="text-xs text-slate-500 font-medium">Ortalama Skor</p>
        <p className="text-xl font-bold">%{metrics.avgScore}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mb-2"><BrainCircuit size={20} /></div>
        <p className="text-xs text-slate-500 font-medium">AI Güven Ortalaması</p>
        <p className="text-xl font-bold">%{metrics.avgConf}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg mb-2"><ShieldAlert size={20} /></div>
        <p className="text-xs text-slate-500 font-medium">Ortalama Ciddiyet</p>
        <p className="text-xl font-bold">%{metrics.avgSev}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mb-2"><Filter size={20} /></div>
        <p className="text-xs text-slate-500 font-medium">Veri Oranı</p>
        <p className="text-xl font-bold">%{metrics.filterRatio}</p>
      </div>
    </div>
  );
}