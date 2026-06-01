# Vercel Deployment

Bu repo iki ayrı Next.js uygulaması içerir:

- `apps/admin-panel`: platform yönetim paneli
- `apps/islek-app`: işletme/kafe uygulaması

Vercel tarafında aynı GitHub reposundan iki ayrı Project oluşturun.

## Storage

Veriler Redis üzerinde tutulur. Production için Vercel Marketplace üzerinden Upstash Redis oluşturup her iki projeye de aynı bağlantı bilgisini verin.

Gerekli env:

```bash
REDIS_URL=rediss://...
```

Kod native Redis protokolünü `ioredis` ile kullanır. Bu yüzden Upstash'te REST URL değil, Redis/TLS bağlantı URL'si kullanılmalıdır. Kod sırasıyla `REDIS_URL`, `KV_URL`, `UPSTASH_REDIS_URL` değerlerini okur.

## Admin Panel Env

`apps/admin-panel` projesinde şu env değerlerini tanımlayın:

```bash
ADMIN_PASSWORD=<admin-giris-sifresi>
ADMIN_SESSION_SECRET=<uzun-random-session-secret>
REDIS_URL=rediss://...
```

`ADMIN_PASSWORD` admin login ekranında girilecek şifredir. `ADMIN_SESSION_SECRET` cookie doğrulaması için kullanılır ve şifreden farklı, uzun random bir değer olmalıdır.

Eski kurulumlar için `ADMIN_SECRET` hala desteklenir, ancak yeni deploy için `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` kullanılmalıdır.

## Kafe Uygulaması Env

`apps/islek-app` projesinde şu env değerini tanımlayın:

```bash
REDIS_URL=rediss://...
```

İşletme kullanıcıları ve şifreleri admin panelde oluşturulur; ayrıca app tarafında sabit bir kullanıcı env’i yoktur.

## Vercel Project Ayarları

Her uygulama için ayrı Project:

1. GitHub reposunu import edin.
2. Project root olarak ilgili klasörü seçin:
   - Admin: `apps/admin-panel`
   - App: `apps/islek-app`
3. Framework preset: Next.js.
4. Root Directory ayarlarında dış kaynak dosyalarına erişim seçeneğini etkin tutun. Uygulamalar `packages/db` workspace paketini kullanır.
5. Env değişkenlerini Production ve Preview için ekleyin.
6. Deploy edin.

Env değişkeni değiştirirseniz Vercel eski deployları güncellemez; yeni deploy/redeploy gerekir.
