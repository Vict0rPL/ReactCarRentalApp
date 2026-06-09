import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

type Car = {
  id: string;
  name: string;
  brand: string;
  price: number;
};

export default function NewReservationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
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

  function calculateDays() {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  function handleReserve() {
    if (!fromDate || !toDate) {
      setSnackMessage('Wpisz datę od i do.');
      setSnackVisible(true);
      return;
    }
    const days = calculateDays();
    if (days === 0) {
      setSnackMessage('Data końcowa musi być po dacie początkowej.');
      setSnackVisible(true);
      return;
    }
    const totalPrice = days * (car?.price ?? 0);

    setSaving(true);
    fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carId: id,
        carName: `${car?.brand} ${car?.name}`,
        fromDate,
        toDate,
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

  const days = calculateDays();

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Text variant="headlineSmall">{car.brand} {car.name}</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>{car.price} PLN / dzień</Text>

      <TextInput
        label="Data od (RRRR-MM-DD)"
        value={fromDate}
        onChangeText={setFromDate}
        style={styles.input}
        mode="outlined"
        placeholder="np. 2025-05-01"
      />
      <TextInput
        label="Data do (RRRR-MM-DD)"
        value={toDate}
        onChangeText={setToDate}
        style={styles.input}
        mode="outlined"
        placeholder="np. 2025-05-05"
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
        disabled={saving}
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
  input: {
    marginBottom: 4,
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
