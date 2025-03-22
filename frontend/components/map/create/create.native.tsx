import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MapView, { Marker, Polygon, Region, MapPressEvent } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MarkerData from '@/type/feature/map/MarkerData';
import Mode from '@/type/feature/map/Mode';
import MapParams from '@/type/feature/map/params';
import { useErrors } from '@/hooks/providers/ErrorProvider';
import { useLanguage } from '@/hooks/providers/LanguageProvider';
import ModeButton from '@/components/map/button';
import { pushSpot } from '@/services/MapService';

const DrawingMap: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [zoom] = useState<number>(13);
  const { setErrorMessage, setErrorVisible } = useErrors();
  const { i18n } = useLanguage();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [rectanglePoints, setRectanglePoints] = useState<[number, number][] | null>(null);
  const [tempRectPoint, setTempRectPoint] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<Mode>('none');
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
          setErrorMessage(i18n.t('Geolocation refused, fallback on Paris'));
          setErrorVisible(true);
          setCenter([48.8566, 2.3522]);
        }
      );
    } else {
      setErrorMessage('Geolocation refused, fallback on Paris');
      setErrorVisible(true);
      setCenter([48.8566, 2.3522]);
    }
  }, []);

  let region: Region | undefined;
  if (center) {
    const latitudeDelta = 100 / zoom;
    const longitudeDelta = 100 / zoom;
    region = {
      latitude: center[0],
      longitude: center[1],
      latitudeDelta,
      longitudeDelta,
    };
  }

  useEffect(() => {
    const saveData = async () => {
      if (!center) return;
      const data = { markers, rectangle: rectanglePoints, center, zoom };
      try {
        await AsyncStorage.setItem('mapData', JSON.stringify(data));
      } catch (e) {
        setErrorMessage(i18n.t('Backup error'));
        setErrorVisible(true);
      }
    };
    saveData();
  }, [markers, rectanglePoints, center, zoom]);

  const handleMapPress = (e: MapPressEvent) => {
    if (!mode) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (mode === 'marker') {
      setMarkers((prev) => [
        ...prev,
        { position: [latitude, longitude], label: `Marker ${prev.length + 1}` },
      ]);
      setMode('none');
    } else if (mode === 'rectangle') {
      if (!tempRectPoint) {
        setTempRectPoint([latitude, longitude]);
      } else {
        const [lat1, lng1] = tempRectPoint;
        const lat2 = latitude, lng2 = longitude;
        const topLat = Math.max(lat1, lat2);
        const bottomLat = Math.min(lat1, lat2);
        const leftLng = Math.min(lng1, lng2);
        const rightLng = Math.max(lng1, lng2);
        setRectanglePoints([
          [topLat, leftLng],
          [topLat, rightLng],
          [bottomLat, rightLng],
          [bottomLat, leftLng],
        ]);
        setTempRectPoint(null);
        setMode('none');
      }
    }
  };

  const rectangleCenter = rectanglePoints
    ? [
      rectanglePoints.reduce((acc, [lat]) => acc + lat, 0) / rectanglePoints.length,
      rectanglePoints.reduce((acc, [, lng]) => acc + lng, 0) / rectanglePoints.length,
    ]
    : null;

  const handleSaveData = async () => {
    if (!rectanglePoints) {
      setErrorMessage(i18n.t('Please draw a rectangle'));
      setErrorVisible(true);
      return;
    }
    const data: MapParams = {
      markers,
      square: {
        topLeft: rectanglePoints[0],
        topRight: rectanglePoints[1],
        bottomRight: rectanglePoints[2],
        bottomLeft: rectanglePoints[3],
      },
      center: rectangleCenter,
      zoom,
      status: true
    };
    await pushSpot(data);
  };

  const goToPosition = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const removeMarker = (index: number) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMarkerLabelChange = (index: number, newLabel: string) => {
    setMarkers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, label: newLabel } : m))
    );
  };

  const removeRectangle = () => setRectanglePoints(null);

  if (!center || !region) {
    return (
      <View style={styles.loader}>
        <Text>{i18n.t('Position loading')}...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles.map} ref={mapRef} region={region} onPress={handleMapPress} showsUserLocation>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.position[0], longitude: marker.position[1] }}
            title={marker.label}
          />
        ))}
        {rectanglePoints && (
          <Polygon
            coordinates={rectanglePoints.map(([lat, lng]) => ({ latitude: lat, longitude: lng }))}
            strokeColor="red"
            fillColor="rgba(255,0,0,0.3)"
          />
        )}
      </MapView>

      <View style={styles.overlayContainer}>
        <ScrollView contentContainerStyle={styles.overlayContent}>
          <View style={{ padding: 20 }}>
            <ModeButton
              currentMode={mode}
              modeValue="marker"
              label={i18n.t('MarkerMode')}
              onPress={() => setMode('marker')}
            />
            <ModeButton
              currentMode={mode}
              modeValue="rectangle"
              label={i18n.t('RectangleMode')}
              onPress={() => setMode('rectangle')}
            />
            <ModeButton
              currentMode={mode}
              modeValue="none"
              label={i18n.t('None')}
              onPress={() => setMode('none')}
            />
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{i18n.t('Markers')}:</Text>
            {markers.map((m, i) => (
              <View key={i} style={styles.infoRow}>
                <Button title="👉" onPress={() => goToPosition(parseFloat(m.position[0].toFixed(2)), parseFloat(m.position[1].toFixed(2)))} />
                <TextInput
                  style={styles.input}
                  value={m.label}
                  onChangeText={(txt) => handleMarkerLabelChange(i, txt)}
                />
                <Text>
                  ({m.position[0].toFixed(2)}, {m.position[1].toFixed(2)})
                </Text>
                <TouchableOpacity onPress={() => removeMarker(i)}>
                  <Text style={styles.removeText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {rectanglePoints && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{i18n.t('Rectangle')}:</Text>
              <Text>
                {i18n.t('TopLeft')}: [{rectanglePoints[0][0].toFixed(2)}, {rectanglePoints[0][1].toFixed(2)}]
              </Text>
              <Text>
                {i18n.t('TopRight')}: [{rectanglePoints[1][0].toFixed(2)}, {rectanglePoints[1][1].toFixed(2)}]
              </Text>
              <Text>
                {i18n.t('BottomRight')}: [{rectanglePoints[2][0].toFixed(2)}, {rectanglePoints[2][1].toFixed(2)}]
              </Text>
              <Text>
                {i18n.t('BottomLeft')}: [{rectanglePoints[3][0].toFixed(2)}, {rectanglePoints[3][1].toFixed(2)}]
              </Text>
              <Button title={i18n.t("Delete rectangle")} onPress={removeRectangle} />
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button title={i18n.t("Save Changes")} onPress={handleSaveData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 200,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden',
    opacity: 0.95,
    zIndex: 50,
  },
  overlayContent: {
    padding: 8,
  },
  infoBox: {
    marginTop: 10,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  removeText: {
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    width: 60,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default DrawingMap;
