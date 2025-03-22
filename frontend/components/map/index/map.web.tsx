import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import MapParams from '@/type/feature/map/params';
import 'leaflet/dist/leaflet.css';

const MapScreen: React.FC<MapParams> = ({center,markers,square,zoom,status}:MapParams) => {
  const squarePositions = [
    square.topLeft,
    square.topRight,
    square.bottomRight,
    square.bottomLeft,
  ];
  
  return (
    <>
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
      <Polygon positions={squarePositions} />
    </MapContainer>
    </>
  );
};

export default MapScreen;