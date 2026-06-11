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
