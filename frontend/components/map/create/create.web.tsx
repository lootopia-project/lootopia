import React, { useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import  {Map as LeafletMap} from 'leaflet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'leaflet/dist/leaflet.css';
import MarkerData from '@/type/feature/map/MarkerData';
import Mode from '@/type/feature/map/Mode';
import MapParams from '@/type/feature/map/params';
import { useErrors } from '@/hooks/providers/ErrorProvider';
import { useLanguage } from '@/hooks/providers/LanguageProvider';
import { pushSpot } from '@/services/MapService';

const DrawingMap: React.FC = () => {
    const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]);
    const [zoom] = useState<number>(13);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [rectanglePoints, setRectanglePoints] = useState<[number, number][] | null>(null);
    const [tempRectPoint, setTempRectPoint] = useState<[number, number] | null>(null);
    const [mode, setMode] = useState<Mode>('none');
    const { setErrorMessage, setErrorVisible } = useErrors();
    const { i18n } = useLanguage();
    const mapRef = useRef<LeafletMap>(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCenter([pos.coords.latitude, pos.coords.longitude]);
                },
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

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!mode) return;
                const { lat, lng } = e.latlng;
                if (mode === 'marker') {
                    setMarkers((prev) => [...prev, { position: [lat, lng], label: `Point ${prev.length + 1}` }]);
                    setMode('none');
                } else if (mode === 'rectangle') {
                    if (!tempRectPoint) {
                        setTempRectPoint([lat, lng]);
                    } else {
                        const [lat1, lng1] = tempRectPoint;
                        const lat2 = lat;
                        const lng2 = lng;
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
            },
        });
        return null;
    }
    const handleMarkerLabelChange = (index: number, newLabel: string) => {
        setMarkers((prev) =>
            prev.map((m, i) => (i === index ? { ...m, label: newLabel } : m))
        );
    };

    const rectangleCenter = rectanglePoints
        ? [
            rectanglePoints.reduce((acc, [lat]) => acc + lat, 0) / rectanglePoints.length,
            rectanglePoints.reduce((acc, [, lng]) => acc + lng, 0) / rectanglePoints.length,
        ]
        : null;
        const goToMarker = (index: number) => {
            const marker = markers[index];
            if (mapRef.current && marker) {
              mapRef.current.setView(marker.position, zoom);
            }
          };
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

    const removeMarker = (index: number) => {
        setMarkers((prev) => prev.filter((_, i) => i !== index));
    };

    const removeRectangle = () => setRectanglePoints(null);

    if (!center) {
        return <div>{i18n.t('Position loading')}...</div>;
    }
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} ref={mapRef}>
            <TileLayer
                attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            <div
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, backgroundColor: 'white', padding: 10, overflowY: 'scroll', height: '50vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='mb-2 flex flex-col'>
                    <button
                        className={`px-4 py-2 mb-2 rounded ${mode === 'marker'
                                ? 'bg-white text-blue-500 border border-blue-500'
                                : 'bg-blue-500 text-white'
                            }`}
                        onClick={(e) => { e.stopPropagation(); setMode('marker'); }}
                    >
                        {i18n.t('MarkerMode')}
                    </button>
                    <button
                        className={`px-4 py-2 mb-2 rounded ${mode === 'rectangle'
                                ? 'bg-white text-blue-500 border border-blue-500'
                                : 'bg-blue-500 text-white'
                            }`}
                        onClick={(e) => { e.stopPropagation(); setMode('rectangle'); }}
                    >
                        {i18n.t('RectangleMode')}
                    </button>
                    <button
                        className={`px-4 py-2 mb-2 rounded ${mode === 'none'
                                ? 'bg-white text-blue-500 border border-blue-500'
                                : 'bg-blue-500 text-white'
                            }`}
                        onClick={(e) => { e.stopPropagation(); setMode('none'); }}
                    >
                        {i18n.t('None')}
                    </button>
                </div>
                <div>
                    {markers.length > 0 &&
                        <div>
                            <strong>{i18n.t('Markers')}:</strong>
                            {markers.map((m, i) => (
                                <div key={i} className="mb-1">
                                    <div className="flex items-center justify-between">
                                        <button onClick={(e) => { e.stopPropagation(); goToMarker(i); }}>👉</button>
                                        <input
                                            className="border px-1 py-0.5 mr-2 w-24"
                                            value={m.label}
                                            onChange={(e) => handleMarkerLabelChange(i, e.target.value)}
                                        />
                                        <span className="text-xs">
                                            [{m.position[0].toFixed(4)}, {m.position[1].toFixed(4)}]
                                        </span>
                                        <button className="text-xs text-red-500 px-1 ml-2 rounded" onClick={() => removeMarker(i)}>X</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                    {rectanglePoints && (
                        <div>
                            <strong>{i18n.t('Rectangle')}:</strong>
                            <div>
                                {i18n.t('TopLeft')}: [{rectanglePoints[0][0].toFixed(4)}, {rectanglePoints[0][1].toFixed(4)}]
                            </div>
                            <div>
                                {i18n.t('TopRight')}: [{rectanglePoints[1][0].toFixed(4)}, {rectanglePoints[1][1].toFixed(4)}]
                            </div>
                            <div>
                                {i18n.t('BottomRight')}: [{rectanglePoints[2][0].toFixed(4)}, {rectanglePoints[2][1].toFixed(4)}]
                            </div>
                            <div>
                                {i18n.t('BottomLeft')}: [{rectanglePoints[3][0].toFixed(4)}, {rectanglePoints[3][1].toFixed(4)}]
                            </div>
                            <button className='bg-red-500 text-white px-4 py-2 mb-2 rounded' onClick={removeRectangle}>{i18n.t('Delete rectangle')}</button>
                        </div>
                    )}
                </div>
            </div>
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                    <Popup>{marker.label}</Popup>
                </Marker>
            ))}
            {rectanglePoints && <Polygon positions={rectanglePoints} />}

            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                <button className='bg-blue-500 text-white px-4 py-2 mb-2 rounded' onClick={handleSaveData}>{i18n.t('Save Changes')}</button>
            </div>
        </MapContainer>
    );
};

export default DrawingMap;
