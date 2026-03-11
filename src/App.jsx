import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Filter, Users, Star, BarChart3, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState('All');

  useEffect(() => {
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
    });
  }, []);

  const uniqueSurveys = useMemo(() => {
    const ids = data.map(item => item.survey_id).filter(Boolean);
    return ['All', ...new Set(ids)];
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedSurvey === 'All') return data;
    return data.filter(item => item.survey_id === selectedSurvey);
  }, [data, selectedSurvey]);

  // --- ANALİZ MANTIKLARI ---
  
  // 1. Ortalama Skor Hesaplama (Eğer CSV'de 'score' veya benzeri sayısal bir alan varsa)
  // Not: Senin verinde skor alanı yoksa burayı toplam katılımcı sayısı gibi revize edebiliriz.
  const averageScore = useMemo(() => {
    const scores = filteredData.map(d => parseFloat(d.score)).filter(n => !isNaN(n));
    if (scores.length === 0) return 0;
    return ((scores.reduce((a, b) => a + b, 0) / scores.length) * 100).toFixed(2);
  }, [filteredData]);

  // 2. Grafik Verisi Hazırlama (Örn: Skor dağılımı veya Yanıt sayıları)
  const chartData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item.score || "Belirsiz";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: `Skor ${key}`, value: counts[key] })).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight">NE DENDY? ANALYTICS</h1>
            <p className="text-slate-500 text-sm">Müşteri Deneyimi Analiz Paneli</p>
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* METRİK KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Users size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Toplam Katılım</p>
                  <p className="text-2xl font-bold">{filteredData.length}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="p-4 bg-amber-100 text-amber-600 rounded-xl"><Star size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Ortalama Skor</p>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><BarChart3 size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Filtreli Veri %</p>
                  <p className="text-2xl font-bold">%{((filteredData.length / data.length) * 100).toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* GRAFİK VE DETAYLAR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-6 flex items-center">
                  <BarChart3 className="mr-2 text-indigo-500" size={20} /> Skor Dağılım Grafiği
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Info className="mr-2 text-indigo-500" size={20} /> Analiz Notları
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <strong>Özet:</strong> {selectedSurvey === 'All' ? 'Tüm anketlerin' : `#${selectedSurvey} numaralı anketin`} verileri üzerinden hazırlanan analizde toplam {filteredData.length} kayıt incelenmiştir.
                  </div>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Veri seti içerisinde boş satırlar otomatik olarak ayıklandı.</li>
                    <li>Skor alanları sayısal veriye dönüştürülerek ortalama hesaplandı.</li>
                    <li>Responsive tasarım ile mobil cihazlara uyumluluk sağlandı.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;