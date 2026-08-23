# Supabase Auth + Resend SMTP

Maile auth (rejestracja, reset hasła) z domeny `1take.pl` przez Resend.

## Szybki start

### 1. Resend

1. Konto: [resend.com/signup](https://resend.com/signup) (darmowo **3000 maili/mies.**)
2. **Domains** → dodaj `1take.pl` → skopiuj rekordy DNS (SPF, DKIM) do panelu domeny
3. Po weryfikacji: **API Keys** → utwórz klucz `re_...`

### 2. Supabase (automatycznie)

```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."   # Account → Access Tokens
export RESEND_API_KEY="re_..."           # Resend → API Keys

npm run supabase:resend
```

Skrypt ustawia:
- SMTP Resend (`smtp.resend.com:465`, user `resend`)
- nadawcę `1take.records <contact@1take.pl>`
- Site URL + redirect URLs
- szablony HTML z logo (`supabase/email-templates/`)

### 3. Ręcznie (alternatywa)

Dashboard → **Authentication → Emails → SMTP Settings**:

| Pole | Wartość |
|---|---|
| Enable Custom SMTP | ✅ |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | `re_...` (API key) |
| Sender email | `contact@1take.pl` |
| Sender name | `1take.records` |

Szablony HTML: wklej z `supabase/email-templates/confirmation.html` i `recovery.html`.

## DNS dla 1take.pl

W panelu domeny (OVH, Cloudflare, itd.) dodaj rekordy z Resend → Domains → `1take.pl`.

Typowo:
- **TXT** (SPF)
- **CNAME** (DKIM × 2–3)

Weryfikacja trwa od kilku minut do kilku godzin.

## Test

1. Wejdź na `https://www.1take.pl/booking`
2. Zarejestruj testowe konto
3. Sprawdź skrzynkę — mail powinien mieć logo i nadawcę `contact@1take.pl`
4. Logi: [Resend → Emails](https://resend.com/emails)

## Ważne

- **Wyłącz email tracking** w Resend (jeśli włączony) — psuje linki potwierdzające Supabase
- Dopóki domena nie jest zweryfikowana, Resend pozwala tylko na `onboarding@resend.dev` jako nadawcę (do testów)
- `RESEND_API_KEY` **nie** dodawaj do Vercel — używany tylko w Supabase SMTP, nie w aplikacji Next.js

## URL produkcji

| | |
|---|---|
| Strona | https://www.1take.pl |
| Vercel | https://1take-records-site.vercel.app |
| Supabase | https://jvzfxcrysoiplswczaml.supabase.co |

## Admin booking

Rejestracja na `/booking` z `admin@1take.records` → trigger ustawia `is_admin = true`.
