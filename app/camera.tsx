import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturing, setCapturing] = useState(false);
  const router = useRouter();

  if (!permission) {
    // Uprawnienia się ładują
    return <View style={styles.center} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Potrzebujemy dostępu do aparatu.</Text>
        <Button mode="contained" onPress={requestPermission}>
          Zezwól
        </Button>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setCapturing(false);
    if (photo) {
      // Wróć do edycji profilu i przekaż URI zdjęcia jako parametr
      router.dismissTo({
        pathname: '/edit-profile',
        params: { photoUri: photo.uri },
      });
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="front">
        <View style={styles.controls}>
          <Button
            mode="contained"
            onPress={takePicture}
            loading={capturing}
            disabled={capturing}
            style={styles.captureButton}>
            Zrób zdjęcie
          </Button>
          <Button
            mode="outlined"
            textColor="#fff"
            onPress={() => router.back()}
            style={styles.backButton}>
            Anuluj
          </Button>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  captureButton: {
    width: 200,
  },
  backButton: {
    width: 200,
    borderColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
