// Funkcje pomocnicze do obliczeń na datach rezerwacji.

/**
 * Zwraca liczbę dni między dwiema datami (RRRR-MM-DD).
 * Zwraca 0, gdy daty są nieprawidłowe lub data końcowa nie jest po początkowej.
 */
export function calculateDays(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return 0;
  }
  const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

/**
 * Oblicza łączną cenę rezerwacji: liczba dni × cena za dzień.
 */
export function calculateTotalPrice(fromDate: string, toDate: string, pricePerDay: number): number {
  return calculateDays(fromDate, toDate) * pricePerDay;
}

/**
 * Formatuje obiekt Date jako 'RRRR-MM-DD' według czasu lokalnego.
 * Używa lokalnych części daty (nie toISOString), aby uniknąć przesunięcia o strefę czasową.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Zwraca dzisiejszą datę o godzinie 00:00 w czasie lokalnym.
 */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Zwraca true, gdy data (RRRR-MM-DD) jest wcześniejsza niż dzisiaj.
 * Zwraca false dla nieprawidłowych dat.
 * Porównuje lokalne części daty, aby uniknąć pułapki UTC vs czas lokalny.
 */
export function isPastDate(date: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    return false;
  }
  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (isNaN(parsed.getTime())) {
    return false;
  }
  return parsed.getTime() < startOfToday().getTime();
}
