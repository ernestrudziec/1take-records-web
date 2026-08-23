# 1take.records

Landing page studia nagraniowego **1take.records** — czarny, minimalistyczny design.

**Produkcja:** [www.1take.pl](https://www.1take.pl)  
**Vercel:** [1take-records-site.vercel.app](https://1take-records-site.vercel.app)

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- GSAP

## Strony

- `/` — landing (studio, o nas, kontakt, mapa)
- `/booking` — rezerwacja studia (Supabase Auth)

Konfiguracja Auth i szablony maili: [`supabase/AUTH_SETUP.md`](supabase/AUTH_SETUP.md)

## Dev

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```
