// Форматирует ISO-строку времени в вид "HH:MM"
// Пример: "2024-11-24T14:30:00Z" → "14:30"
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
