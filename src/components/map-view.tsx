

'use client';

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { useState, useMemo, useEffect, useRef } from 'react';
import type { Job } from '@/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface MapViewProps {
  jobs: Job[];
  location: string;
  radius: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

// Mock function to geocode addresses
// In a real app, you would use the Google Geocoding API
const geocodeMock = (location: string): { lat: number; lng: number } | null => {
  const loc = location.toLowerCase();
  if (loc.includes('san francisco')) return { lat: 37.7749, lng: -122.4194 };
  if (loc.includes('oakland')) return { lat: 37.8044, lng: -122.2712 };
  if (loc.includes('new york')) return { lat: 40.7128, lng: -74.006 };
  if (loc.includes('chicago')) return { lat: 41.8781, lng: -87.6298 };
  if (loc.includes('los angeles')) return { lat: 34.0522, lng: -118.2437 };
  if (loc.includes('houston')) return { lat: 29.7604, lng: -95.3698 };
  if (loc.includes('phoenix')) return { lat: 33.4484, lng: -112.0740 };
  return null;
};

// Calculate zoom level based on radius in miles
const getZoomLevel = (radius: number) => {
  if (radius > 200) return 5;
  if (radius > 100) return 6;
  if (radius > 50) return 7;
  if (radius > 25) return 8;
  if (radius > 10) return 9;
  return 10;
};

export default function MapView({ jobs, location, radius }: MapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(4);

  const jobLocations = useMemo(() => {
    return jobs
      .map((job) => {
        const coords = geocodeMock(job.location);
        if (coords) {
          return { ...job, position: coords };
        }
        return null;
      })
      .filter((job) => job !== null) as (Job & { position: { lat: number; lng: number } })[];
  }, [jobs]);

  useEffect(() => {
    setZoom(getZoomLevel(radius));
  }, [radius]);

  useEffect(() => {
    if (location) {
      const userCoords = geocodeMock(location);
      if (userCoords) {
        setMapCenter(userCoords);
      }
    } else if (jobLocations.length > 0) {
      setMapCenter(jobLocations[0].position);
    } else {
        setMapCenter(defaultCenter);
    }
  }, [location, jobLocations]);

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-destructive/10 text-destructive">
        Error loading maps. Please check your API key and configuration.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={zoom}
      onLoad={(map) => { mapRef.current = map; }}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {jobLocations.map((job) => (
        <Marker
          key={job.id}
          position={job.position}
          onClick={() => setSelectedJob(job)}
        />
      ))}

      {selectedJob && selectedJob.position && (
        <InfoWindow
          position={selectedJob.position}
          onCloseClick={() => setSelectedJob(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-md mb-1">{selectedJob.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{selectedJob.category}</p>
            {selectedJob.budget && (
                <p className="text-sm font-semibold mb-3">Budget: ${selectedJob.budget}</p>
            )}
            <Button asChild size="sm">
                <Link href={`/dashboard/jobs/${selectedJob.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
