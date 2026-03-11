import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Filter } from 'lucide-react'; // Şık bir ikon ekliyoruz

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hangi anketin seçili olduğunu tutan State (Başlangıçta 'Tümü' seçili)
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
      error: (error) => {
        console.error("Hata oluştu:", error);
        setLoading(false);
      }
    });
  }, []);

  // 1. Benzersiz (Unique) survey_id'leri bulalım
  // useMemo, veri değişmedikçe bu işlemi tekrar tekrar yapmayı engeller, performans katar.
  const uniqueSurveys = useMemo(() => {
    // CSV'deki her satırdan survey_id'yi al, boş olanları ele
    const ids = data.map(item => item.survey_id).filter(Boolean); 
    // Set kullanarak tekrarlayanları yok et ve en başa 'All' (Tümü) seçeneğini ekle
    return ['All', ...new Set(ids)];
  }, [data]);

  // 2. Seçili ID'ye göre ekranda gösterilecek veriyi filtreleyelim
  const filteredData = useMemo(() => {
    if (selectedSurvey === 'All') return data;
    return data.filter(item => item.survey_id === selectedSurvey);
  }, [data, selectedSurvey]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Üst Kısım: Başlık ve Filtre */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Ne Dendy?</h1>
            <p className="text-slate-500 mt-1">İçgörü ve Analiz Paneli</p>
          </div>

          {/* Filtreleme Dropdown (Açılır Menü) */}
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <Filter className="text-slate-400" size={20} />
            <label htmlFor="survey-select" className="font-medium text-slate-700">
              Anket Seç:
            </label>
            <select
              id="survey-select"
              value={selectedSurvey}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {uniqueSurveys.map((id, index) => (
                <option key={index} value={id}>
                  {id === 'All' ? 'Tüm Anketler' : `Anket: ${id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* İçerik Alanı */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading"></div>
            <p className="mt-2 text-slate-500">Veriler işleniyor...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              {selectedSurvey === 'All' ? 'Genel Bakış' : `${selectedSurvey} Detayları`}
            </h2>
            <p className="text-slate-600">
              Şu an ekranda filtrelenmiş <strong>{filteredData.length}</strong> adet yanıt bulunuyor.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;