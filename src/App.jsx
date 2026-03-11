import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Filter, Users, Star, BarChart3, Info, PieChart as PieChartIcon, Target, BrainCircuit, ShieldAlert, Cpu, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

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

  // --- METRİKLER ---
  const metrics = useMemo(() => {
    let scoreSum = 0, scoreCount = 0;
    let confSum = 0, confCount = 0;
    let sevSum = 0, sevCount = 0;

    filteredData.forEach(item => {
      if (!isNaN(parseFloat(item.score))) { scoreSum += parseFloat(item.score); scoreCount++; }
      if (!isNaN(parseFloat(item.confidence))) { confSum += parseFloat(item.confidence); confCount++; }
      if (!isNaN(parseFloat(item.severity))) { sevSum += parseFloat(item.severity); sevCount++; }
    });

    return {
      avgScore: scoreCount > 0 ? ((scoreSum / scoreCount) * 100).toFixed(2) : 0,
      avgConf: confCount > 0 ? ((confSum / confCount) * 100).toFixed(2) : 0,
      avgSev: sevCount > 0 ? ((sevSum / sevCount) * 100).toFixed(2) : 0,
      filterRatio: ((filteredData.length / data.length) * 100).toFixed(2)
    };
  }, [filteredData, data.length]);

  // --- GRAFİKLER ---
  
  // 1. Duygu Dağılımı
  const sentimentData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item.sentiment ? item.sentiment.toLowerCase() : "belirtilmemiş";
      counts[val] = (counts[val] || 0) + 1;
    });
    const translations = { positive: 'Pozitif', negative: 'Negatif', neutral: 'Nötr', belirtilmemiş: 'Belirtilmemiş' };
    return Object.keys(counts).map(key => ({
      name: translations[key] || key,
      value: counts[key]
    })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const SENTIMENT_COLORS = { 'Pozitif': '#10b981', 'Negatif': '#ef4444', 'Nötr': '#f59e0b', 'Belirtilmemiş': '#94a3b8' };

  // 2. AI Model Dağılımı
  const modelData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item.label_model || "Bilinmiyor";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  const MODEL_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316'];

  // 3. Tema (Themes) Analizi
  const themesData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      if (item.themes) {
        try {
          // CSV'den gelen string formatındaki array'i parse et ("['communication']")
          let parsed = item.themes.replace(/'/g, '"');
          let themeArray = JSON.parse(parsed);
          themeArray.forEach(t => {
            counts[t] = (counts[t] || 0) + 1;
          });
        } catch (e) { /* Parse hatası olursa yoksay */ }
      }
    });
    // Sadece en çok bahsedilen ilk 6 temayı alalım grafiği boğmamak için
    return Object.keys(counts)
      .map(key => ({ name: key.replace('_', ' ').toUpperCase(), value: counts[key] }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredData]);

  // 4. Aksiyon (Action) Durumu
  const actionData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item.action ? item.action.toUpperCase() : "BİLİNMİYOR";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* 5 ADET METRİK KARTI */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mb-2"><Users size={20} /></div>
                <p className="text-xs text-slate-500 font-medium">Katılım</p>
                <p className="text-xl font-bold">{filteredData.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mb-2"><Star size={20} /></div>
                <p className="text-xs text-slate-500 font-medium">Ortalama Memnuniyet</p>
                <p className="text-xl font-bold">%{metrics.avgScore}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mb-2"><BrainCircuit size={20} /></div>
                <p className="text-xs text-slate-500 font-medium">AI Güven Ortalaması</p>
                <p className="text-xl font-bold">%{metrics.avgConf}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg mb-2"><ShieldAlert size={20} /></div>
                <p className="text-xs text-slate-500 font-medium">Ortalama Şiddet</p>
                <p className="text-xl font-bold">%{metrics.avgSev}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mb-2"><Filter size={20} /></div>
                <p className="text-xs text-slate-500 font-medium">Veri Oranı</p>
                <p className="text-xl font-bold">%{metrics.filterRatio}</p>
              </div>
            </div>

            {/* GRAFİKLER BÖLÜMÜ (2x2 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Grafik 1: Duygu (Sentiment) */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold mb-4 flex items-center text-slate-700">
                  <PieChartIcon className="mr-2 text-indigo-500" size={18} /> Duygu Analizi (Sentiment)
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grafik 2: Öne Çıkan Temalar */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold mb-4 flex items-center text-slate-700">
                  <Hash className="mr-2 text-indigo-500" size={18} /> Öne Çıkan Konular (Themes)
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={themesData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontWeight: 600, fontSize: 10}} width={100} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grafik 3: Aksiyon Durumu */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold mb-4 flex items-center text-slate-700">
                  <Target className="mr-2 text-indigo-500" size={18} /> Aksiyon Önerileri (Action)
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={actionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grafik 4: AI Modelleri */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold mb-4 flex items-center text-slate-700">
                  <Cpu className="mr-2 text-indigo-500" size={18} /> Değerlendiren AI Modelleri
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={modelData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={3} dataKey="value">
                        {modelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODEL_COLORS[index % MODEL_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                      <Legend verticalAlign="right" layout="vertical" align="right" wrapperStyle={{ fontSize: '12px' }} iconType="circle"/>
                    </PieChart>
                  </ResponsiveContainer>
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