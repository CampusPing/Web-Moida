import React, { useEffect, useRef } from 'react';

export interface Assembly {
  id: string;
  districtName: string;
  dong: string;
  startDateTime: string;
  endDateTime: string;
  place: string;
  peopleCount: number;
  latitude: number;
  longitude: number;
}

interface Props {
  assemblies: Assembly[];
  selectedAssemblyId: string | null;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatPeopleCount = (count: number) => {
  return `${count.toLocaleString('en-US')}명`;
};

const AssemblyMap: React.FC<Props> = ({ assemblies, selectedAssemblyId }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const markersMapRef = useRef<{[key: string]: naver.maps.Marker}>({}); // New ref to store markers by ID
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (mapDivRef.current && !mapRef.current) {
      // Initialize Map
      const map = new naver.maps.Map(mapDivRef.current, {
        center: new naver.maps.LatLng(37.5665, 126.9780), // Default: Seoul
        zoom: 10,
      });
      mapRef.current = map;

      // Initialize InfoWindow
      infoWindowRef.current = new naver.maps.InfoWindow({
        content: '',
        backgroundColor: '#fff',
        borderColor: '#B3D7FF',
        borderWidth: 1,
        anchorSize: new naver.maps.Size(10, 10),
        pixelOffset: new naver.maps.Point(20, -20),
      });

      // Close info window when map is clicked
      naver.maps.Event.addListener(map, 'click', () => {
        infoWindowRef.current?.close();
      });
    }
  }, []); // Runs only once

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Clear existing markers
    markersRef.current.forEach(marker => naver.maps.Event.clearInstanceListeners(marker));
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    markersMapRef.current = {}; // Clear the map of markers
    infoWindowRef.current?.close();

    if (assemblies.length === 0) return;

    // 2. Add new markers
    const newMarkers: naver.maps.Marker[] = [];
    assemblies.forEach(assembly => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(assembly.latitude, assembly.longitude),
        map: map,
        icon: {
          url: '/assembly_marker.png',
          size: new naver.maps.Size(36, 36),
          scaledSize: new naver.maps.Size(36, 36),
          anchor: new naver.maps.Point(18, 36)
        }
      });

      // Store marker by ID
      markersMapRef.current[assembly.id] = marker;

      // Add click event to each marker
      naver.maps.Event.addListener(marker, 'click', () => {
        const content = `
          <div style="padding: 10px; line-height: 1.5;">
            <div style="font-weight: bold; margin-bottom: 5px;">${assembly.place}</div>
            <div>- 시간: ${formatTime(assembly.startDateTime)} ~ ${formatTime(assembly.endDateTime)}</div>
            <div>- 인원: ${formatPeopleCount(assembly.peopleCount)}</div>
          </div>
        `;
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(map, marker);
      });

      newMarkers.push(marker);
    });
    markersRef.current = newMarkers;

    // 3. Adjust map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new naver.maps.LatLngBounds(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newMarkers[0].getPosition() as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newMarkers[0].getPosition() as any
      );
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [assemblies]);

  // Effect to handle selectedAssemblyId change (from table click)
  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!map || !infoWindow) return;

    if (selectedAssemblyId) {
      const marker = markersMapRef.current[selectedAssemblyId];
      if (marker) {
        map.panTo(marker.getPosition());
        map.setZoom(15); // Zoom in a bit

        // Open info window for the selected marker
        const assembly = assemblies.find(a => a.id === selectedAssemblyId);
        if (assembly) {
            const content = `
              <div style="padding: 10px; line-height: 1.5;">
                <div style="font-weight: bold; margin-bottom: 5px;">${assembly.place}</div>
                <div>- 시간: ${formatTime(assembly.startDateTime)} ~ ${formatTime(assembly.endDateTime)}</div>
                <div>- 인원: ${formatPeopleCount(assembly.peopleCount)}</div>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        }
      }
    } else {
      infoWindow.close();
    }
  }, [selectedAssemblyId, assemblies]); // Add assemblies to dependency array

  return <div ref={mapDivRef} style={{ width: '100%', height: '60vh' }} />;
};

export default AssemblyMap;