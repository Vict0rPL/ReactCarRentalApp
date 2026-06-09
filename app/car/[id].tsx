import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

type Car = {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  description: string;
  image: string;
};

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetch(`${API_URL}/Cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!car) {
    return (
      <View style={styles.center}>
        <Text>Nie znaleziono auta.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Card>
        <Card.Cover source={{ uri: car.image }} />
        <Card.Content style={styles.content}>
          <Text variant="headlineMedium">{car.brand} {car.name}</Text>
          <Text variant="bodyLarge" style={styles.year}>Rok: {car.year}</Text>
          <Text variant="headlineSmall" style={styles.price}>{car.price} PLN / dzień</Text>
          <Text variant="bodyMedium" style={styles.description}>{car.description}</Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push(`/reserve/${car.id}`)}>
        Zarezerwuj
      </Button>
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
  content: {
    paddingTop: 12,
  },
  year: {
    marginTop: 8,
    color: '#687076',
  },
  price: {
    marginTop: 8,
    color: '#0a7ea4',
  },
  description: {
    marginTop: 12,
  },
  button: {
    marginTop: 8,
  },
});
