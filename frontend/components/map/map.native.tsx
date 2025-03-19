import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission de géolocalisation non accordée');
        setRegion({
          latitude: 51.505,
          longitude: -0.09,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (!region) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.map} region={region} showsUserLocation>
      {/* Vous pouvez ajouter ici d'autres composants comme des Marker */}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
