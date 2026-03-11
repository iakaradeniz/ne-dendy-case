import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function App() {
  // Verimizi tutacağımız State (başlangıçta boş bir dizi)
  const [data, setData] = useState([]);
  
  // Yüklenme durumunu tutacağımız State
  const [loading, setLoading] = useState(true);

  // Bileşen ekrana geldiğinde sadece 1 kez çalışacak Effect
  useEffect(() => {
    Papa.parse('/data.csv', {
      download: true, // Dosyayı public klasöründen indirir gibi çeker
      header: true,   // CSV'nin ilk satırını başlık (key) olarak kabul eder
      skipEmptyLines: true, // Boş satırları atlar, hata önler
      complete: (results) => {
        console.log("Okunan Veri:", results.data); // Veriyi konsola yazdır
        setData(results.data); // State'e kaydet
        setLoading(false); // Yüklenme bitti
      },
      error: (error) => {
        console.error("Hata oluştu:", error);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Ne Dendy? - İçgörü Paneli</h1>
        
        {loading ? (
          <p className="text-blue-500 font-semibold text-lg">Veriler yükleniyor, lütfen bekleyin...</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-green-600 font-semibold text-lg">
              Harika! {data.length} adet veri satırı başarıyla okundu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;