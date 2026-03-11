import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import DashboardHeader from './components/DashboardHeader';
import MetricCards from './components/MetricCards';
import ChartsSection from './components/ChartsSection';

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
      filterRatio: data.length > 0 ? ((filteredData.length / data.length) * 100).toFixed(2) : 0
    };
  }, [filteredData, data.length]);

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

  const modelData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item.label_model || "Bilinmiyor";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  const themesData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      if (item.themes) {
        try {
          let parsed = item.themes.replace(/'/g, '"');
          let themeArray = JSON.parse(parsed);
          themeArray.forEach(t => {
            counts[t] = (counts[t] || 0) + 1;
          });
        } catch (e) {}
      }
    });
    return Object.keys(counts)
      .map(key => ({ name: key.replace('_', ' ').toUpperCase(), value: counts[key] }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredData]);

  const actionData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item.action ? item.action.toUpperCase() : "BİLİNMİYOR";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  const SENTIMENT_COLORS = { 'Pozitif': '#10b981', 'Negatif': '#ef4444', 'Nötr': '#f59e0b', 'Belirtilmemiş': '#94a3b8' };
  const MODEL_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316'];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader 
          uniqueSurveys={uniqueSurveys} 
          selectedSurvey={selectedSurvey} 
          setSelectedSurvey={setSelectedSurvey} 
        />
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <MetricCards count={filteredData.length} metrics={metrics} />
            <ChartsSection 
              sentimentData={sentimentData} 
              themesData={themesData} 
              actionData={actionData} 
              modelData={modelData}
              SENTIMENT_COLORS={SENTIMENT_COLORS}
              MODEL_COLORS={MODEL_COLORS}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;