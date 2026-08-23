export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram not configured — skipping notification.");
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    console.error("Telegram notification failed:", await response.text());
  }
}

export function formatBookingTelegramMessage({
  action,
  userName,
  startAt,
  endAt,
  notes,
}: {
  action: "created" | "updated" | "cancelled";
  userName: string;
  startAt: string;
  endAt: string;
  notes?: string | null;
}) {
  const labels = {
    created: "🆕 Nowy booking",
    updated: "✏️ Zmiana bookingu",
    cancelled: "❌ Odwołany booking",
  };

  const start = new Date(startAt).toLocaleString("pl-PL");
  const end = new Date(endAt).toLocaleString("pl-PL");

  return [
    `<b>${labels[action]}</b>`,
    `👤 ${userName}`,
    `🕐 ${start} → ${end}`,
    notes ? `📝 ${notes}` : null,
    `📍 1take.records — Tęczowa 23, Wrocław`,
  ]
    .filter(Boolean)
    .join("\n");
}
