import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, Region } from 'react-native-maps';
import MapParams from '@/type/feature/map/params';
import 'leaflet/dist/leaflet.css';

const MapScreen: React.FC<MapParams> = ({center,markers,square,zoom}:MapParams) => {
  const latitudeDelta = 100 / zoom;
  const longitudeDelta = 100 / zoom;

  const region: Region = {
    latitude: center ? center[0] : 0,
    longitude: center ? center[1] : 0,
    latitudeDelta,
    longitudeDelta,
  };

  const squareCoordinates = [
    { latitude: square.topLeft[0], longitude: square.topLeft[1] },
    { latitude: square.topRight[0], longitude: square.topRight[1] },
    { latitude: square.bottomRight[0], longitude: square.bottomRight[1] },
    { latitude: square.bottomLeft[0], longitude: square.bottomLeft[1] },
  ];

  return (
    <MapView style={styles.map} region={region} showsUserLocation>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: marker.position[0], longitude: marker.position[1] }}
          title={marker.label}
        />
      ))}
      <Polygon coordinates={squareCoordinates} />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapScreen;