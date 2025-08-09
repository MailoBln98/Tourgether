import React from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  gpx: string;
};

function parseGPX(gpx: string): [number, number][] {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpx, 'application/xml');
    const trkpts = Array.from(xml.getElementsByTagName('trkpt'));
    return trkpts.map(pt => [
      parseFloat(pt.getAttribute('lat') || '0'),
      parseFloat(pt.getAttribute('lon') || '0'),
    ]);
  } catch {
    return [];
  }
}

const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions);
    }
  }, [positions, map]);
  return null;
};

const GPXThumbnail: React.FC<Props> = ({ gpx }) => {
  const positions = parseGPX(gpx);
  const center = positions.length > 0 ? positions[0] : [51, 10];

  return (
    <MapContainer
      style={{ height: 120, width: '100%' }}
      center={center}
      zoom={8}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.length > 1 && (
        <>
          <Polyline positions={positions} color="blue" />
          <FitBounds positions={positions} />
        </>
      )}
    </MapContainer>
  );
};

export default GPXThumbnail;