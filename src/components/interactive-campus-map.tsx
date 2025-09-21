
'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLng, LatLngBounds } from 'leaflet';
import { buildings, type Building } from '@/lib/data';
import { ReportDialog } from './report-dialog';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Utensils, Users, GraduationCap, PartyPopper, AlertCircle } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// Leaflet's default icons are not easily available in Next.js.
// This manually sets the icon paths.
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons for Alerts
const getIcon = (category: string) => {
  let icon;
  switch (category) {
    case 'Free Food':
      icon = <Utensils />;
      break;
    case 'Crowded Area':
      icon = <Users />;
      break;
    case 'Study Space':
      icon = <GraduationCap />;
      break;
    case 'Campus Event':
      icon = <PartyPopper />;
      break;
    default:
      icon = <AlertCircle />;
  }
  return L.divIcon({
    html: ReactDOMServer.renderToString(
      <div className="bg-background p-2 rounded-full shadow-lg border">{icon}</div>
    ),
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export type Alert = {
  id: string;
  category: string;
  details: string;
  location: { latitude: number; longitude: number };
  timestamp: { seconds: number; nanoseconds: number };
};

// Define the boundaries for the Purdue campus
const campusBounds = new LatLngBounds(
  [40.417, -86.935], // Southwest corner
  [40.437, -86.905]  // Northeast corner
);

interface InteractiveCampusMapProps {
  selectedBuilding: Building | null;
  isFullscreen?: boolean;
}

const InteractiveCampusMap = ({ selectedBuilding, isFullscreen }: InteractiveCampusMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<LatLng | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const alertMarkersRef = useRef<L.LayerGroup>(L.layerGroup());

  useEffect(() => {
    // Initialize the map
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        minZoom: 14, // Prevent zooming out too far
        maxBounds: campusBounds, // Restrict panning to campus
      }).setView([40.427, -86.915], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Add building markers
      buildings.forEach(building => {
        L.marker(building.coords)
          .addTo(mapInstance.current!)
          .bindPopup(`<b>${building.name}</b><br><a href="/locations/${building.slug}">View Details</a>`);
      });

      // Add click handler to map
      mapInstance.current.on('click', (e) => {
        // Only allow reporting within campus bounds
        if (campusBounds.contains(e.latlng)) {
          setClickedCoords(e.latlng);
          setDialogOpen(true);
        }
      });
      
      // Add the marker layer group to the map
      alertMarkersRef.current.addTo(mapInstance.current);
    }

    // Subscribe to alerts from Firestore
    const q = query(collection(db, 'alerts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const alertsData: Alert[] = [];
      querySnapshot.forEach((doc) => {
        alertsData.push({ id: doc.id, ...doc.data() } as Alert);
      });
      setAlerts(alertsData);
    });

    return () => {
      unsubscribe();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update alert markers on the map
    if (mapInstance.current) {
      alertMarkersRef.current.clearLayers();
      alerts.forEach(alert => {
        const alertLatLng = new L.LatLng(alert.location.latitude, alert.location.longitude);
        const marker = L.marker(alertLatLng, { icon: getIcon(alert.category) })
          .bindPopup(`<b>${alert.category}</b><br>${alert.details}<br><small>${new Date(alert.timestamp.seconds * 1000).toLocaleString()}</small>`);
        alertMarkersRef.current.addLayer(marker);
      });
    }
  }, [alerts]);

  useEffect(() => {
    if (mapInstance.current && selectedBuilding) {
      mapInstance.current.flyTo(selectedBuilding.coords, 18);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (mapInstance.current) {
      // Delay helps ensure the container has resized before invalidating
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 100);
    }
  }, [isFullscreen]);


  return (
    <>
      <div ref={mapRef} style={{ height: '100%', width: '100%', zIndex: 0 }} />
      <ReportDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        coords={clickedCoords}
      />
    </>
  );
};

export default InteractiveCampusMap;
