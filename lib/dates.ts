export function dateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function parseDateOnly(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function today(): Date {
  return dateOnly(new Date());
}

export function nightsBetween(checkIn: Date, checkOut: Date): Date[] {
  const nights: Date[] = [];
  let current = dateOnly(checkIn);
  const end = dateOnly(checkOut);
  while (current.getTime() < end.getTime()) {
    nights.push(current);
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
  return nights;
}
