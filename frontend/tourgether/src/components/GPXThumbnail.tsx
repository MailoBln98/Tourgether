import React from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  gpx: string;
  height?: number;
  zoomable?: boolean; // Add zoomable prop
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

const GPXThumbnail: React.FC<Props> = ({ gpx, height = 120, zoomable = false }) => {
  const positions = parseGPX(gpx);
  const center = positions.length > 0 ? positions[0] : [51, 10];

  return (
    <div
      className="rounded border mb-3 shadow-sm"
      style={{
        height,
        minHeight: height,
        width: '100%',
        overflow: 'hidden',
        background: '#e9ecef'
      }}
    >
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={center}
        zoom={8}
        scrollWheelZoom={zoomable}
        dragging={zoomable}
        doubleClickZoom={zoomable}
        zoomControl={zoomable}
        attributionControl={false}
        className="w-100 h-100"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 1 && (
          <>
            <Polyline positions={positions} color="#0d6efd" weight={4} opacity={0.8} />
            {/* Start marker */}
            <CircleMarker center={positions[0]} radius={7} pathOptions={{ color: '#198754', fillColor: '#198754', fillOpacity: 1 }} />
            {/* End marker */}
            <CircleMarker center={positions[positions.length - 1]} radius={7} pathOptions={{ color: '#dc3545', fillColor: '#dc3545', fillOpacity: 1 }} />
            <FitBounds positions={positions} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default GPXThumbnail;