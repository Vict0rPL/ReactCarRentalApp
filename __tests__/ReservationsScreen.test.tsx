import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

import ReservationsScreen from '@/app/(tabs)/reservations';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (callback: () => void | (() => void)) => {
    const ReactModule = require('react');
    ReactModule.useEffect(() => callback(), []);
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

function renderScreen() {
  return render(
    <PaperProvider>
      <ReservationsScreen />
    </PaperProvider>
  );
}

function mockFetchResolving(data: unknown) {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(data) })
  );
}

describe('ReservationsScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pokazuje komunikat o braku rezerwacji dla pustej listy', async () => {
    mockFetchResolving([]);
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Brak rezerwacji.')).toBeTruthy();
    });
  });

  it('renderuje rezerwacje zwrócone z API', async () => {
    mockFetchResolving([
      {
        id: '1',
        carName: 'BMW Seria 3',
        fromDate: '2025-05-01',
        toDate: '2025-05-05',
        totalPrice: 600,
        status: 'active',
      },
    ]);
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('BMW Seria 3')).toBeTruthy();
    });
    expect(screen.getByText('Łącznie: 600 PLN')).toBeTruthy();
  });
});
