function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Long-form localized date, e.g. "12 October 2023" / "12 اکتوبر ۲۰۲۳".
// `numberingSystem: "latn"` keeps digits Latin in Urdu UI text.
export function formatLongDate(value, locale = "en") {
  const date = typeof value === "string" ? parseISODate(value) : value;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(date);
}

// Localized 12-hour clock time, e.g. "9:00 AM".
export function formatTime(value, locale = "en") {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
