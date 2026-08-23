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
  actorName,
  startAt,
  endAt,
  previousStartAt,
  previousEndAt,
  notes,
}: {
  action: "created" | "updated" | "cancelled";
  userName: string;
  actorName?: string;
  startAt: string;
  endAt: string;
  previousStartAt?: string;
  previousEndAt?: string;
  notes?: string | null;
}) {
  const labels = {
    created: "🆕 Nowy booking",
    updated: "✏️ Zmiana bookingu",
    cancelled: "❌ Odwołany booking",
  };

  const start = new Date(startAt).toLocaleString("pl-PL");
  const end = new Date(endAt).toLocaleString("pl-PL");
  const previous =
    previousStartAt && previousEndAt
      ? `${new Date(previousStartAt).toLocaleString("pl-PL")} → ${new Date(previousEndAt).toLocaleString("pl-PL")}`
      : null;

  return [
    `<b>${labels[action]}</b>`,
    `👤 ${userName}`,
    actorName && actorName !== userName ? `🛠️ Zmienił: ${actorName}` : null,
    previous ? `↩️ Było: ${previous}` : null,
    `🕐 ${start} → ${end}`,
    notes ? `📝 ${notes}` : null,
    `📍 1take.records — Tęczowa 23, Wrocław`,
  ]
    .filter(Boolean)
    .join("\n");
}
