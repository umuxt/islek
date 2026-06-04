# POS Terminali Entegrasyon Fizibilite Raporu

İşlek uygulamasının basit bir adisyon takip sisteminden tam donanımlı bir restoran otomasyonuna dönüşebilmesi için fiziksel POS terminali (kredi/banka kartı çekim cihazı) entegrasyonu en kritik adımdır. Bu raporda, web tabanlı (bulut) bir uygulamanın fiziksel bir cihaza nasıl bağlanabileceği, Türkiye'deki yasal mevzuat (GİB YN ÖKC) ve teknik entegrasyon modelleri incelenmiştir.

---

## 1. Çalışma Mantığı ve Bağlantı Yöntemleri

Web tarayıcısında (HTTPS) çalışan İşlek istemcisinin, masadaki garsonun elindeki fiziksel bir POS cihazını tetikleyebilmesi için 3 temel mimari mevcuttur:

```mermaid
flowchart TD
    subgraph Bulut Entegrasyonu (Önerilen)
        BrowserA[İşlek Tarayıcı] -->|HTTPS POST| BackendA[İşlek API Server]
        BackendA -->|REST API| CloudPOS[POS Entegratör Bulutu]
        CloudPOS -->|4G/Wi-Fi MQTT/WS| DeviceA[Fiziksel Android POS]
    end

    subgraph Yerel Ağ Entegrasyonu (Köprü Yazılımlı)
        BrowserB[İşlek Tarayıcı] -->|CORS Bypassed localhost:9000| LocalAgent[Yerel Köprü Agent / Node.js]
        LocalAgent -->|Local TCP Sockets| DeviceB[Fiziksel POS (Local IP)]
    end
```

### A. Bulut Tabanlı Entegrasyon (Cloud-to-Cloud API) - *SaaS için En Temiz Model*
* **Mantık:** Fiziksel POS cihazı (genellikle Android tabanlı yeni nesil cihazlar) internete Wi-Fi veya SIM kart (4G) ile bağlıdır ve POS firmasının bulut sunucusuyla sürekli açık bir soket bağlantısı (MQTT/WebSocket) sürdürür.
* **Akış:**
  1. Garson tarayıcıdan "Kart ile Öde" butonuna basar.
  2. Web uygulaması kendi backend sunucumuza (İşlek API) istek atar.
  3. İşlek API, POS entegratörünün bulut API'sine (örn. Token Gateway) ödeme miktarını ve cihaz ID'sini bildirir.
  4. Entegratör bulutu, ilgili fiziksel POS cihazına push bildirimi gönderir.
  5. Cihaz uykudan uyanır, ekranda tutarı gösterir ve temassız kart kabul moduna geçer.
  6. Ödeme tamamlandığında POS, entegratör bulutuna sinyal gönderir; entegratör de İşlek backend'ine **webhook (callback)** atarak ödemeyi doğrular.
* **Avantajları:**
  - Kablo, yerel ağ ayarı veya IP sabitleme derdi yoktur.
  - Cihaz ve bilgisayarın aynı Wi-Fi ağına bağlı olması gerekmez.
  - SaaS modeline %100 uygundur.
* **Dezavantajları:** İnternet kesilirse veya entegratör sunucusunda gecikme olursa sistem çalışmaz.

### B. Yerel Ağ Entegrasyonu (Local IP TCP/IP Socket veya WebSocket)
* **Mantık:** POS cihazı kafenizin yerel Wi-Fi ağına bağlıdır ve üzerinde bir TCP portu (ör. 8080) üzerinden komut bekler.
* **Akış:**
  - Tarayıcılar güvenlik nedeniyle (HTTPS'ten HTTP yerel IP'ye istek atamama - *Mixed Content* ve *CORS* kısıtlamaları) doğrudan yerel ağdaki bir IP'ye TCP soket isteği atamaz.
  - Bu yüzden kasadaki bilgisayarda arka planda çalışan ufak bir **"Köprü Agent" (Local Bridge Agent - Node.js/Rust/Python)** kurulur.
  - Tarayıcı kendi bilgisayarındaki bu aracıya (`http://localhost:9000`) istek atar.
  - Yerel aracı, ağ protokolünü (ör. TCP soket veya GMP3 protokolü) kullanarak yerel IP üzerinden POS cihazına komutu iletir.
* **Avantajları:** İnternet yavaş olsa dahi yerel ağda anında ve çok hızlı tetiklenir.
* **Dezavantajları:** Kafe içine kurulum yapılması, cihazlara statik IP tanımlanması ve yerel yazılım kurulması gerekir. Ölçeklenebilir SaaS için operasyon yükü çok yüksektir.

### C. Kablolu Seri Haberleşme (USB / RS232)
* **Mantık:** Kasada sabit duran PC'ye USB veya Seri Port kablosuyla bağlı POS terminalidir.
* **Akış:** Tarayıcılarda bulunan **Web Serial API** sayesinde tarayıcı üzerinden doğrudan seri porttaki POS cihazına byte düzeyinde komut gönderilebilir.
* **Kullanım Yeri:** Sadece sabit kasa noktaları için uygundur. Masadan masaya gezen garson el terminalleri için kullanılamaz.

---

## 2. Türkiye Yasal Mevzuatı (GİB YN ÖKC)

Türkiye'de restoran ve kafelerde ödeme alma süreci Gelir İdaresi Başkanlığı (GİB) tarafından sıkı denetlenmektedir.
* **YN ÖKC (Yeni Nesil Ödeme Kaydedici Cihaz) Zorunluluğu:** Masada ödeme alan tüm cihazların yasal olarak mali onaylı fiş (özel bilgi fişi veya e-arşiv fatura) basması zorunludur.
* **GMP3 Protokolü:** Türkiye'deki POS cihazlarının büyük kısmı (Beko, Profilo, Ingenico) yazar kasa entegrasyonu için yasal standart olan **GMP3** protokolünü kullanır. Yazılımımızın bu cihazlarla konuşabilmesi için mali onaylı entegratör köprüleri kullanması veya e-arşiv fatura kesebilmesi gerekir.

---

## 3. Türkiye Pazarındaki Entegrasyon Seçenekleri

İşlek projesi için entegrasyon yapabileceğimiz en uygun 3 partner adayının değerlendirmesi:

| Partner / Entegratör | Çalışma Mantığı | Zorluk Derecesi | Türkiye Pazarı Durumu |
| :--- | :--- | :--- | :--- |
| **Token Finansal Teknolojiler (Beko 300TR / 400TR)** | Bulut Entegrasyonu (Token Gateway API) | **Kolay (Dokümantasyonu çok başarılı)** | Kafe/Restoran sektöründe en yaygın lider cihaz ailesi. Koç Holding güvencesinde. |
| **Ingenico (İnterpay)** | Hem Bulut (Cloud) hem Yerel Soket (GMP3) | **Orta** | Yaygın kullanılan bir diğer terminal üreticisi. API/SDK desteği mevcuttur. |
| **SoftPOS API'leri (PayTR / iyzico Mobil POS)** | Bulut API / NFC Entegrasyonu | **Çok Kolay** | Ekstra POS cihazı satın almadan garsonun Android telefonunun arkasına kart okutularak ödeme alınmasını sağlar. Yasal olarak e-arşiv entegrasyonu gerektirir. |

---

## 4. İşlek İçin Önerilen Entegrasyon Yol Haritası

İşlek'in bulut tabanlı bir SaaS yapısı olması göz önüne alındığında, **Token Finansal Teknolojiler (Token Gateway)** üzerinden bulut entegrasyonu yapılması en hızlı ve operasyonsuz çözümdür.

### Aşama 1: Token API Üyeliği ve Test Terminali
Token firmasının geliştirici portalından API key alınır. Beko 300TR/400TR test cihazı (sandbox) talep edilir.

### Aşama 2: API Route Oluşturma (`/api/payments/trigger-pos`)
Web uygulamasından tetiklenecek sunucu tarafı endpoint'i hazırlanır:
```typescript
// Örnek Backend Tetikleyici Akış Şeması
export async function POST(req: Request) {
  const { totalAmount, posDeviceId, tableId } = await req.json();
  
  // 1. Token Cloud API'ye ödeme başlatma isteği gönder
  const tokenRes = await fetch('https://api.tokenpay.com.tr/v1/payments', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.TOKEN_API_KEY}` },
    body: JSON.stringify({ amount: totalAmount, device_id: posDeviceId })
  });
  
  const paymentSession = await tokenRes.json();
  
  // 2. İşlek veritabanında bu masanın durumunu 'ödeme_bekliyor' olarak güncelle
  await setSessionStatus(tableId, 'payment_pending', paymentSession.id);
  
  return Response.json({ success: true, paymentSessionId: paymentSession.id });
}
```

### Aşama 3: Webhook (Callback) Endpoint'i (`/api/payments/webhook`)
POS cihazı ödemeyi başarıyla tamamladığında Token sunucuları bizim sistemimizi tetikler:
```typescript
export async function POST(req: Request) {
  const payload = await req.json(); // Token'dan gelen ödeme sonucu
  
  if (payload.status === 'SUCCESS') {
    const tableId = await getTableIdByPaymentSession(payload.session_id);
    
    // Masayı otomatik olarak kapat ve ödemeyi kaydet
    await closeTableAndSavePayment(tableId, {
      tutar: payload.amount,
      yontem: 'kredi_karti',
      zamani: new Date().toISOString()
    });
  }
  
  return Response.json({ received: true });
}
```

---

## 5. Sonuç ve Öneriler

* **Fizibilite Kararı:** İşlek için kablolu veya yerel ağ köprüleri kurmak yerine **Bulut API entegrasyonu (Cloud POS)** seçilmelidir. Bu sayede sıfır yerel ağ ayarı ile tarayıcıdan tek tıkla ödeme tetiklenebilir.
* **Maliyet & Yasal Durum:** Türkiye şartlarında en mantıklı yol **Beko (Token) iş ortaklığı programına** başvurarak yazılım entegrasyon belgesi almaktır. Alternatif olarak, fiziki cihaz maliyetini sıfırlamak için garsonların kendi telefonlarını POS haline getiren **SoftPOS (iyzico/PayTR)** teknolojisi değerlendirilebilir.
