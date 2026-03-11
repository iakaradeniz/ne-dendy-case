import React from 'react';
import { Filter } from 'lucide-react';

export default function DashboardHeader({ uniqueSurveys, selectedSurvey, setSelectedSurvey }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">NE DENDY? ANALYTICS</h1>
        <p className="text-slate-500 text-sm">Yapay Zeka Destekli İçgörü Paneli</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center bg-slate-100 p-1 rounded-xl">
        <div className="px-3 py-2 text-slate-500"><Filter size={18} /></div>
        <select
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
          className="bg-transparent font-semibold text-slate-700 py-2 pr-8 pl-2 focus:outline-none cursor-pointer"
        >
          {uniqueSurveys.map(id => (
            <option key={id} value={id}>{id === 'All' ? 'Tüm Anketler' : `Anket #${id}`}</option>
          ))}
        </select>
      </div>
    </div>
  );
}