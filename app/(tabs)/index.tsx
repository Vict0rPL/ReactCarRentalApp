import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, ActivityIndicator, Text, Searchbar } from 'react-native-paper';
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
  const [query, setQuery] = useState('');
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

  // Filtrujemy listę aut po marce i nazwie (bez rozróżniania wielkości liter)
  const filtered = cars.filter((car) =>
    `${car.brand} ${car.name}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.list, { paddingTop: insets.top + 16 }]}
      ListHeaderComponent={
        <Searchbar
          placeholder="Szukaj auta"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      }
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
  search: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
  },
});
