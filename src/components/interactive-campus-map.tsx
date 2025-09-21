
'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLng, LatLngBounds } from 'leaflet';
import { buildings, type Building } from '@/lib/data';
import { ReportDialog } from './report-dialog';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Utensils, Users, GraduationCap, PartyPopper, AlertCircle, MapPin } from 'lucide-react';
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
const getAlertIcon = (category: string) => {
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


// Function to get color for building markers based on activity
const getActivityColor = (rating: number) => {
  if (rating <= 1) return '#00FF00'; // Green
  if (rating <= 2) return '#ADFF2F'; // Green-Yellow
  if (rating <= 3) return '#FFFF00'; // Yellow
  if (rating <= 4) return '#FFA500'; // Orange
  return '#FF0000'; // Red
};

const getBuildingIcon = (rating: number | undefined) => {
  const color = rating !== undefined ? getActivityColor(rating) : '#808080'; // Grey for no data
  const iconHtml = ReactDOMServer.renderToString(
    <div className="relative">
      <MapPin style={{ color: color, stroke: 'black', strokeWidth: '0.5' }} size={32} />
    </div>
  );
  return L.divIcon({
    html: iconHtml,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};


export type Alert = {
  id: string;
  category: string;
  details: string;
  location: { latitude: number; longitude: number };
  timestamp: { seconds: number; nanoseconds: number };
};

type ActivityData = {
  averageRating: number;
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
  const buildingMarkersRef = useRef<L.LayerGroup>(L.layerGroup());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<LatLng | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const alertMarkersRef = useRef<L.LayerGroup>(L.layerGroup());
  const [activityLevels, setActivityLevels] = useState<Record<string, ActivityData>>({});


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

      // Add click handler to map
      mapInstance.current.on('click', (e) => {
        // Only allow reporting within campus bounds
        if (campusBounds.contains(e.latlng)) {
          setClickedCoords(e.latlng);
          setDialogOpen(true);
        }
      });
      
      // Add the marker layer groups to the map
      buildingMarkersRef.current.addTo(mapInstance.current);
      alertMarkersRef.current.addTo(mapInstance.current);
    }
    
    // Subscribe to building activity
    const activityQuery = query(collection(db, 'locations_activity'));
    const unsubscribeActivity = onSnapshot(activityQuery, (snapshot) => {
        const newActivityLevels: Record<string, ActivityData> = {};
        snapshot.forEach((doc) => {
            newActivityLevels[doc.id] = doc.data() as ActivityData;
        });
        setActivityLevels(newActivityLevels);
    });

    // Subscribe to alerts from Firestore
    const alertsQuery = query(collection(db, 'alerts'));
    const unsubscribeAlerts = onSnapshot(alertsQuery, (querySnapshot) => {
      const alertsData: Alert[] = [];
      querySnapshot.forEach((doc) => {
        alertsData.push({ id: doc.id, ...doc.data() } as Alert);
      });
      setAlerts(alertsData);
    });

    return () => {
      unsubscribeActivity();
      unsubscribeAlerts();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
      if (mapInstance.current) {
        buildingMarkersRef.current.clearLayers();

        buildings.forEach(building => {
            const activity = activityLevels[building.id.toString()];
            const rating = activity ? activity.averageRating : undefined;
            const activityText = activity 
              ? `<b>Activity:</b> ${activity.averageRating.toFixed(1)}/5 (${activity.averageRating <=2 ? "Not Busy" : activity.averageRating <= 4 ? "Moderately Busy" : "Very Busy"})`
              : "<b>Activity:</b> No data";

            const popupContent = `
              <b>${building.name}</b>
              <br>
              ${activityText}
              <br>
              <a href="/locations/${building.slug}">View Details</a>
            `;
            
            L.marker(building.coords, { icon: getBuildingIcon(rating) })
              .addTo(buildingMarkersRef.current)
              .bindPopup(popupContent);
        });
      }
  }, [activityLevels]);

  useEffect(() => {
    // Update alert markers on the map
    if (mapInstance.current) {
      alertMarkersRef.current.clearLayers();
      alerts.forEach(alert => {
        const alertLatLng = new L.LatLng(alert.location.latitude, alert.location.longitude);
        const marker = L.marker(alertLatLng, { icon: getAlertIcon(alert.category) })
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
