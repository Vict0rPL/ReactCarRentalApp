import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Image, ScrollView, Linking } from 'react-native';
import { Card, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter, useFocusEffect } from 'expo-router';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Odświeżaj profil za każdym razem gdy wrócimy na ten ekran
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('profile').then((value) => {
        if (value) {
          const profile = JSON.parse(value);
          setName(profile.name ?? '');
          setEmail(profile.email ?? '');
          setPhoto(profile.photo ?? '');
        }
      });
    }, [])
  );

  function getLocation() {
    setLoadingLocation(true);
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setLocation('Brak dostępu do lokalizacji.');
        setLoadingLocation(false);
        return;
      }
      Location.getCurrentPositionAsync({}).then((loc) => {
        const lat = loc.coords.latitude.toFixed(4);
        const lon = loc.coords.longitude.toFixed(4);
        setLocation(`${lat}, ${lon}`);
        setLoadingLocation(false);
      });
    });
  }

  // Otwiera pobrane współrzędne w aplikacji map urządzenia
  function openInMaps() {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location}`);
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{name ? name[0].toUpperCase() : '?'}</Text>
        </View>
      )}

      <Text variant="headlineMedium" style={styles.name}>{name || 'Brak imienia'}</Text>
      <Text variant="bodyMedium" style={styles.email}>{email || 'Brak e-maila'}</Text>

      <Button
        mode="contained"
        onPress={() => router.push('/edit-profile')}
        style={styles.button}>
        Edytuj profil
      </Button>

      <Card style={styles.card}>
        <Card.Title title="Aktualna lokalizacja (GPS)" />
        <Card.Content>
          {loadingLocation ? (
            <ActivityIndicator />
          ) : (
            <Text>{location || 'Naciśnij przycisk, aby pobrać.'}</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button onPress={getLocation}>Pobierz GPS</Button>
          {location.includes(',') && (
            <Button onPress={openInMaps}>Otwórz w mapach</Button>
          )}
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    marginBottom: 4,
  },
  email: {
    marginBottom: 24,
    color: '#687076',
  },
  button: {
    marginBottom: 24,
    width: '100%',
  },
  card: {
    width: '100%',
  },
});
