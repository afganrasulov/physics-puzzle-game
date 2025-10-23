# Fizik Bulmacaları - Physics Puzzle Game

13 yaş çocuklar için eğitici ve eğlenceli bir fizik tabanlı bulmaca oyunu. Angry Birds tarzında nesne fırlatma mekaniği ile fizik yasalarını öğrenin!

## 🎮 Oyun Hakkında

Bu oyun, çocukların fizik kavramlarını eğlenceli bir şekilde öğrenmelerini sağlamak için tasarlanmıştır. Oyuncular, farklı malzemelerden yapılmış hedefleri vurmak için nesneleri fırlatır ve fizik yasalarını kullanarak bulmacaları çözer.

## ✨ Özellikler

- **10 Farklı Seviye**: Kolay seviyelerden zorlu bulmacalara kadar
- **Gerçekçi Fizik Motoru**: Matter.js ile güçlendirilmiş gerçekçi fizik simülasyonu
- **Farklı Mermi Tipleri**:
  - 🔴 Normal: Dengeli güç ve ağırlık
  - ⚫ Ağır: Daha fazla hasar, daha yavaş
  - 💗 Zıplayan: Hafif ve yüksek sekme
- **Farklı Malzemeler**:
  - 🪵 Ahşap: Orta dayanıklılık
  - 🪨 Taş: Yüksek dayanıklılık
  - 💎 Cam: Kırılgan
  - 🔩 Metal: Çok dayanıklı
- **Yıldız Sistemi**: Her seviyede performansa göre 1-3 yıldız kazanın
- **Görsel Yardımcılar**: Fırlatma çizgisi ve güç göstergesi
- **Türkçe Arayüz**: Tamamen Türkçe menüler ve açıklamalar

## 🎯 Nasıl Oynanır?

1. **Seviye Seç**: Ana menüden oynamak istediğiniz seviyeyi seçin
2. **Fırlat**: Fareyle tıklayın, sürükleyin ve bırakın
3. **Hedefleri Vur**: Tüm hedefleri yok edin
4. **Yıldız Kazan**: Daha yüksek skor = Daha fazla yıldız

### Stratejiler

- **Açı Önemli**: Farklı açılardan atış yaparak en iyi sonucu bulun
- **Malzemeleri Tanı**: Cam kolay kırılır, taş daha sağlamdır
- **Zincirleme Reaksiyon**: Domino etkisi yaratarak tek atışla birden fazla hedef vurun
- **Doğru Mermiyi Seç**: Her mermi tipinin kendine özgü özellikleri vardır

## 🛠️ Teknolojiler

- **React 19**: Modern UI framework
- **Matter.js**: 2D fizik motoru
- **HTML5 Canvas**: Oyun render
- **TypeScript**: Tip güvenli kod
- **Tailwind CSS**: Stil ve tasarım
- **Vite**: Hızlı geliştirme ortamı

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- pnpm (veya npm/yarn)

### Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Geliştirme sunucusunu başlat
pnpm dev

# Tarayıcıda aç
# http://localhost:3000
```

### Production Build

```bash
# Build oluştur
pnpm build

# Build'i önizle
pnpm preview
```

## 📁 Proje Yapısı

```
client/
├── src/
│   ├── components/
│   │   ├── Game.tsx           # Ana oyun bileşeni
│   │   ├── LevelSelect.tsx    # Seviye seçim ekranı
│   │   ├── TrajectoryLine.tsx # Fırlatma yardımcı çizgisi
│   │   └── ui/                # UI bileşenleri
│   ├── lib/
│   │   ├── gameConstants.ts   # Oyun sabitleri
│   │   ├── levels.ts          # Seviye tanımları
│   │   └── types.ts           # TypeScript tipleri
│   ├── pages/
│   │   └── Home.tsx           # Ana sayfa
│   └── App.tsx                # Uygulama kök bileşeni
└── public/                    # Statik dosyalar
```

## 🎓 Eğitsel Değer

Bu oyun çocuklara şunları öğretir:

- **Fizik Kavramları**:
  - Yerçekimi ve serbest düşüş
  - Momentum ve kinetik enerji
  - Sürtünme ve elastikiyet
  - Açı ve yörünge hesaplamaları

- **Problem Çözme Becerileri**:
  - Stratejik düşünme
  - Deneme-yanılma yöntemi
  - Neden-sonuç ilişkisi
  - Planlama ve tahmin

- **Malzeme Özellikleri**:
  - Farklı malzemelerin dayanıklılığı
  - Yoğunluk ve kütle kavramları
  - Elastikiyet ve kırılganlık

## 🎨 Özelleştirme

### Yeni Seviye Ekleme

`client/src/lib/levels.ts` dosyasına yeni seviye ekleyin:

```typescript
{
  id: 11,
  name: 'Yeni Seviye',
  description: 'Açıklama',
  projectiles: [{ type: 'normal', count: 3 }],
  targets: [
    {
      x: 600,
      y: 400,
      width: 40,
      height: 40,
      type: 'rectangle',
      material: 'wood',
      points: 100,
    },
  ],
  obstacles: [],
  requiredScore: 100,
  stars: { one: 100, two: 150, three: 200 },
}
```

### Yeni Malzeme Ekleme

`client/src/lib/gameConstants.ts` dosyasında `MATERIALS` objesine yeni malzeme ekleyin.

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Eğlenceli oyunlar! 🎮🎯**

