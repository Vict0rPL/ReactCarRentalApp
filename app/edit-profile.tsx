import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);
  const router = useRouter();
  // Aparat zwraca URI zdjęcia przez parametr routera
  const params = useLocalSearchParams<{ photoUri?: string }>();

  useEffect(() => {
    AsyncStorage.getItem('profile').then((value) => {
      if (value) {
        const profile = JSON.parse(value);
        setName(profile.name ?? '');
        setEmail(profile.email ?? '');
        setPhoto(profile.photo ?? '');
      }
    });
  }, []);

  // Gdy wrócimy z ekranu aparatu, params.photoUri będzie zawierał URI zdjęcia
  useEffect(() => {
    if (params.photoUri) {
      setPhoto(params.photoUri as string);
    }
  }, [params.photoUri]);

  function handleSave() {
    const profile = { name, email, photo };
    AsyncStorage.setItem('profile', JSON.stringify(profile)).then(() => {
      setSnackVisible(true);
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{name ? name[0].toUpperCase() : '?'}</Text>
        </View>
      )}

      <Button
        mode="outlined"
        onPress={() => router.push('/camera')}
        style={styles.cameraButton}>
        Zrób zdjęcie profilowe
      </Button>

      <TextInput
        label="Imię i nazwisko"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Zapisz profil
      </Button>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
          router.back();
        }}
        duration={2000}>
        Profil zapisany!
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraButton: {
    width: '100%',
  },
  input: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
});
