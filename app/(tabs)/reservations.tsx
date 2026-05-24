import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, ActivityIndicator, Text, Badge } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { API_URL } from '@/constants/api';

type Reservation = {
  id: string;
  carName: string;
  fromDate: string;
  toDate: string;
  totalPrice: number;
  status: 'active' | 'cancelled';
};

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useFocusEffect odświeża listę po powrocie z ekranu szczegółów
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetch(`${API_URL}/reservations`)
        .then((res) => res.json())
        .then((data) => {
          setReservations(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Brak rezerwacji.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card style={styles.card} onPress={() => router.push(`/reservation/${item.id}`)}>
          <Card.Title
            title={item.carName}
            subtitle={`${item.fromDate} – ${item.toDate}`}
            right={() => (
              <Badge style={item.status === 'active' ? styles.active : styles.cancelled}>
                {item.status === 'active' ? 'Aktywna' : 'Anulowana'}
              </Badge>
            )}
          />
          <Card.Content>
            <Text>Łącznie: {item.totalPrice} PLN</Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  active: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  cancelled: {
    backgroundColor: '#F44336',
    marginRight: 8,
  },
});
