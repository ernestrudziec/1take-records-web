#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF ?? "jvzfxcrysoiplswczaml";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL ?? "contact@1take.pl";
const SENDER_NAME = process.env.RESEND_SENDER_NAME ?? "1take.records";

if (!ACCESS_TOKEN) {
  console.error(
    "Brak SUPABASE_ACCESS_TOKEN → https://supabase.com/dashboard/account/tokens",
  );
  process.exit(1);
}

if (!RESEND_API_KEY) {
  console.error(
    "Brak RESEND_API_KEY → https://resend.com/api-keys (format: re_...)",
  );
  process.exit(1);
}

const templatesDir = join(__dirname, "../supabase/email-templates");
const confirmation = readFileSync(join(templatesDir, "confirmation.html"), "utf8");
const recovery = readFileSync(join(templatesDir, "recovery.html"), "utf8");

const payload = {
  site_url: "https://www.1take.pl",
  uri_allow_list:
    "https://www.1take.pl/**,https://1take-records-site.vercel.app/**,http://localhost:3000/**",
  external_email_enabled: true,
  smtp_admin_email: SENDER_EMAIL,
  smtp_sender_name: SENDER_NAME,
  smtp_host: "smtp.resend.com",
  smtp_port: "465",
  smtp_user: "resend",
  smtp_pass: RESEND_API_KEY,
  mailer_subjects_confirmation: "Potwierdź konto — 1take.records",
  mailer_templates_confirmation_content: confirmation,
  mailer_subjects_recovery: "Reset hasła — 1take.records",
  mailer_templates_recovery_content: recovery,
};

const response = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  },
);

const body = await response.text();

if (!response.ok) {
  console.error(`Błąd ${response.status}:`, body);
  process.exit(1);
}

console.log("OK — Resend SMTP + szablony maili skonfigurowane w Supabase.");
console.log(`Nadawca: ${SENDER_NAME} <${SENDER_EMAIL}>`);
