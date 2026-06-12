import { calculateDays, calculateTotalPrice, formatDate, isPastDate } from './dates';

describe('calculateDays', () => {
  it('liczy liczbę dni dla prawidłowego zakresu', () => {
    expect(calculateDays('2025-05-01', '2025-05-05')).toBe(4);
  });

  it('liczy jeden dzień dla sąsiednich dat', () => {
    expect(calculateDays('2025-05-01', '2025-05-02')).toBe(1);
  });

  it('zwraca 0, gdy data końcowa jest równa początkowej', () => {
    expect(calculateDays('2025-05-01', '2025-05-01')).toBe(0);
  });

  it('zwraca 0, gdy data końcowa jest przed początkową', () => {
    expect(calculateDays('2025-05-05', '2025-05-01')).toBe(0);
  });

  it('zwraca 0 dla nieprawidłowej daty', () => {
    expect(calculateDays('', '2025-05-05')).toBe(0);
    expect(calculateDays('niepoprawna', 'data')).toBe(0);
  });
});

describe('calculateTotalPrice', () => {
  it('mnoży liczbę dni przez cenę za dzień', () => {
    expect(calculateTotalPrice('2025-05-01', '2025-05-05', 150)).toBe(600);
  });

  it('zwraca 0 dla nieprawidłowego zakresu dat', () => {
    expect(calculateTotalPrice('2025-05-05', '2025-05-01', 150)).toBe(0);
  });
});

describe('isPastDate', () => {
  function localDateString(offsetDays: number): string {
    return formatDate(new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000));
  }

  it('zwraca true dla wczorajszej daty', () => {
    expect(isPastDate(localDateString(-1))).toBe(true);
  });

  it('zwraca false dla dzisiejszej daty', () => {
    expect(isPastDate(localDateString(0))).toBe(false);
  });

  it('zwraca false dla przyszłej daty', () => {
    expect(isPastDate(localDateString(30))).toBe(false);
  });

  it('zwraca false dla nieprawidłowej daty', () => {
    expect(isPastDate('')).toBe(false);
    expect(isPastDate('niepoprawna')).toBe(false);
  });
});
