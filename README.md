# Ne Dendy? Veri Analiz Paneli

Bu proje, anket yanıtlarının analiz edilerek anlamlı içgörülere dönüştürüldüğü "Ne Dendy?" modülünün React tabanlı bir prototipidir.

## Nasıl Çalıştırılır?

1. Projeyi klonlayın: `git clone [repo_linki]`
2. Klasöre girin: `cd ne-dendy-case`
3. Bağımlılıkları yükleyin: `npm install`
4. Uygulamayı başlatın: `npm run dev`
5. Tarayıcınızda http://localhost:5173/ adresine giderek paneli görüntüleyin.

## Teknik Tercihler ve Nedenleri
* **Vite & React:** Hızlı kurulum, geliştirme hızı ve yüksek performans için kullanıldı. 

* **PapaParse:** Tarayıcı tarafında CSV dosyalarını sorunsuz ve hızlı bir şekilde okuyabilmek için kullanıldı.

* **Tailwind CSS:** Modern ve temiz arayüzü  hızlı şekilde inşa edebilmek için kullanıldı.

* **Recharts:** Verilerin sadece okunması değil, bir bakışta anlaşılması gerektiği için grafiksel sunum amacıyla kullanıldı.

* **Component Bazlı Mimari:** Uygulama tek bir monolitik dosyadan kurtarılarak DashboardHeader, MetricCards ve ChartsSection gibi tekrar kullanılabilir bileşenlere bölünmüştür. Bu sayede kodun okunabilirliği ve bakımı kolaylaştırılmıştır.


## Geliştirme Önerileri
* **Büyük Veri Yönetimi:** Veri seti çok büyüdüğünde tarayıcıyı yormamak adına tablo/veri sayfalama yapısı eklenebilir.

* **Dinamik Renk Algoritması:** Temalar veya modeller dinamik olarak değiştiğinde renklerin çakışmaması için daha gelişmiş bir dinamik renk atama algoritması yazılabilir.

* **Test Altyapısı:** Veri filtreleme ve hesaplama mantıklarının doğruluğunu garanti altına almak için Jest/React Testing Library ile birim (unit) testleri yazılabilir.