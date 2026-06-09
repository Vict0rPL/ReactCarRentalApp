import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

type Reservation = {
  id: string;
  carName: string;
  fromDate: string;
  toDate: string;
  totalPrice: number;
  status: 'active' | 'cancelled';
};

export default function ReservationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetch(`${API_URL}/reservations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReservation(data);
        setLoading(false);
      });
  }, [id]);

  function handleCancel() {
    setCancelling(true);
    fetch(`${API_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setReservation(updated);
        setCancelling(false);
        setSnackMessage('Rezerwacja anulowana.');
        setSnackVisible(true);
      })
      .catch(() => {
        setCancelling(false);
        setSnackMessage('Błąd podczas anulowania.');
        setSnackVisible(true);
      });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!reservation) {
    return (
      <View style={styles.center}>
        <Text>Nie znaleziono rezerwacji.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Card>
        <Card.Title title={reservation.carName} />
        <Card.Content>
          <Text variant="bodyLarge">Od: {reservation.fromDate}</Text>
          <Text variant="bodyLarge">Do: {reservation.toDate}</Text>
          <Text variant="bodyLarge" style={styles.price}>
            Łączna cena: {reservation.totalPrice} PLN
          </Text>
          <Text
            variant="bodyMedium"
            style={reservation.status === 'active' ? styles.statusActive : styles.statusCancelled}>
            Status: {reservation.status === 'active' ? 'Aktywna' : 'Anulowana'}
          </Text>
        </Card.Content>
      </Card>

      {reservation.status === 'active' && (
        <Button
          mode="contained"
          buttonColor="#F44336"
          onPress={handleCancel}
          loading={cancelling}
          disabled={cancelling}
          style={styles.button}>
          Anuluj rezerwację
        </Button>
      )}

      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
          router.back();
        }}
        duration={2000}>
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
    gap: 16,
  },
  price: {
    marginTop: 8,
    color: '#0a7ea4',
  },
  statusActive: {
    marginTop: 8,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statusCancelled: {
    marginTop: 8,
    color: '#F44336',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 8,
  },
});
