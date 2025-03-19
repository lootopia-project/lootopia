import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const MapScreen: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setPosition([51.505, -0.09]);
        }
      );
    } else {
      setPosition([51.505, -0.09]);
    }
  }, []);

  if (!position) {
    return <div>Chargement de la position...</div>;
  }

  return (
    <MapContainer center={position} zoom={100} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapScreen;
