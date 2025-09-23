# Rafbakki Shop – Starter

Sklep bez płatności online: klient klika **Kup**, Ty i on dostajecie maila; klient robi przelew.

## 0) Wymagania
- Node 18+ (LTS), npm
- Konto Vercel (darmowe wystarczy)

## 1) Uruchom lokalnie
```bash
npm install
npm run dev
```
Lokalnie: http://localhost:3000

## 2) Zmienne środowiskowe
Skopiuj `.env.example` do `.env.local` i uzupełnij:
- `ADMIN_PASSWORD` – hasło do panelu admina
- `SMTP_*` + `ORDERS_TO` – dane do wysyłki maili
- `BANK_ACCOUNT`, `KENNITALA` – dane do przelewu

## 3) Vercel KV i Vercel Blob
W projekcie na Vercel dodaj Integrations:
- **Vercel KV** (doda automatycznie `KV_*`)
- **Vercel Blob** → utwórz **Read-Write Token** i wklej do ENV `BLOB_READ_WRITE_TOKEN`

## 4) Deploy na Vercel
- Import repo / Upload, ustaw ENV jak w `.env.local`
- Po deployu wejdź w **Settings → Domains** i dodaj `shop.rafbakki.is`
- U rejestratora domeny dodaj `CNAME` dla `shop` wskazujący na host z Vercel (np. `cname.vercel-dns.com`)
- SSL włączy się automatycznie

## 5) Dodaj pierwszy produkt
- Wejdź na `/admin` → podaj hasło
- Wpisz `Name`, `Price`, `Description`
- Wgraj obraz (upload → URL wstawi się automatycznie)
- Save → produkt pojawi się na stronie głównej `/`

## 6) Test zamówienia
- Na karcie produktu kliknij **Kup**
- Sprawdź skrzynkę `ORDERS_TO` → powinien przyjść mail z zamówieniem
- Klient otrzyma auto-odpowiedź z danymi do przelewu

### Uwaga o mailach
Skonfiguruj SPF/DKIM/DMARC dla nadawcy `orders@rafbakki.is`, żeby maile nie trafiały do SPAM.

## Struktura
- `/app` – App Router
- `/app/api/order` – wysyłka maili
- `/app/api/admin/blob-upload` – upload obrazów do Vercel Blob
- `/lib/db.ts` – CRUD produktów (Vercel KV)
- `/lib/auth.ts` + `/middleware.ts` – proste logowanie hasłem (ciasteczko)

Powodzenia!


## Lokalny tryb bez Vercel KV
Jeśli **nie** masz ustawionych `KV_REST_API_URL` i `KV_REST_API_TOKEN`, projekt działa lokalnie na **pamięci RAM** (dane znikają po restarcie).
Na produkcji dodaj Vercel KV w Integrations.

## Szybkie pobranie ENV z Vercel
Po utworzeniu projektu na Vercel:
```bash
npm i -g vercel
vercel link    # połącz lokalny folder z projektem Vercel
vercel env pull .env.local
```
