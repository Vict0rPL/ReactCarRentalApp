import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, ActivityIndicator, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

export default function HomeScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetch(`${API_URL}/Cars`)
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Nie można załadować aut.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cars}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.list, { paddingTop: insets.top + 16 }]}
      renderItem={({ item }) => (
        <Card style={styles.card} onPress={() => router.push(`/car/${item.id}`)}>
          <Card.Cover source={{ uri: item.image }} />
          <Card.Title
            title={`${item.brand} ${item.name}`}
            subtitle={`${item.year} · ${item.price} PLN/dzień`}
          />
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
});
