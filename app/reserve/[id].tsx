import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, Snackbar, ActivityIndicator } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';
import {
  calculateDays,
  calculateTotalPrice,
  formatDate,
  isPastDate,
  startOfToday,
} from '@/utils/dates';

type Car = {
  id: string;
  name: string;
  brand: string;
  price: number;
};

export default function NewReservationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetch(`${API_URL}/Cars/${id}`)
      .then((res) => res.json())
      .then((data) => setCar(data));
  }, [id]);

  function handleReserve() {
    if (!fromDate || !toDate) {
      setSnackMessage('Wybierz datę od i do.');
      setSnackVisible(true);
      return;
    }
    const from = formatDate(fromDate);
    const to = formatDate(toDate);
    if (isPastDate(from)) {
      setSnackMessage('Data początkowa nie może być w przeszłości.');
      setSnackVisible(true);
      return;
    }
    const days = calculateDays(from, to);
    if (days === 0) {
      setSnackMessage('Data końcowa musi być po dacie początkowej.');
      setSnackVisible(true);
      return;
    }
    const totalPrice = calculateTotalPrice(from, to, car?.price ?? 0);

    setSaving(true);
    fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carId: id,
        carName: `${car?.brand} ${car?.name}`,
        fromDate: from,
        toDate: to,
        totalPrice,
        status: 'active',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        router.replace('/(tabs)/reservations');
      })
      .catch(() => {
        setSaving(false);
        setSnackMessage('Błąd podczas zapisywania rezerwacji.');
        setSnackVisible(true);
      });
  }

  if (!car) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const days =
    fromDate && toDate ? calculateDays(formatDate(fromDate), formatDate(toDate)) : 0;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Text variant="headlineSmall">{car.brand} {car.name}</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>{car.price} PLN / dzień</Text>

      <Button
        mode="outlined"
        icon="calendar"
        onPress={() => setFromOpen(true)}
        style={styles.dateButton}
        contentStyle={styles.dateButtonContent}>
        {fromDate ? `Data od: ${formatDate(fromDate)}` : 'Wybierz datę od'}
      </Button>
      <Button
        mode="outlined"
        icon="calendar"
        onPress={() => setToOpen(true)}
        style={styles.dateButton}
        contentStyle={styles.dateButtonContent}>
        {toDate ? `Data do: ${formatDate(toDate)}` : 'Wybierz datę do'}
      </Button>

      <DatePickerModal
        locale="pl"
        mode="single"
        visible={fromOpen}
        date={fromDate}
        validRange={{ startDate: startOfToday() }}
        onDismiss={() => setFromOpen(false)}
        onConfirm={({ date }) => {
          setFromOpen(false);
          setFromDate(date);
          // Jeśli data końcowa jest wcześniej niż nowa początkowa, wyczyść ją.
          if (date && toDate && toDate.getTime() < date.getTime()) {
            setToDate(undefined);
          }
        }}
      />
      <DatePickerModal
        locale="pl"
        mode="single"
        visible={toOpen}
        date={toDate}
        validRange={{ startDate: fromDate ?? startOfToday() }}
        onDismiss={() => setToOpen(false)}
        onConfirm={({ date }) => {
          setToOpen(false);
          setToDate(date);
        }}
      />

      {days > 0 && (
        <Text variant="bodyLarge" style={styles.total}>
          Łącznie: {days} dni × {car.price} PLN = {days * car.price} PLN
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleReserve}
        loading={saving}
        disabled={saving || !fromDate || !toDate}
        style={styles.button}>
        Potwierdź rezerwację
      </Button>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}>
        {snackMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    gap: 12,
  },
  subtitle: {
    color: '#687076',
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 4,
  },
  dateButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: 6,
  },
  total: {
    color: '#0a7ea4',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  button: {
    marginTop: 8,
  },
});
