
'use client';

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { useState, useMemo } from 'react';
import type { Job } from '@/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface MapViewProps {
  jobs: Job[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

// Mock function to geocode addresses
// In a real app, you would use the Google Geocoding API
const geocodeMock = (location: string): { lat: number; lng: number } | null => {
  // This is a very simple mock. A real implementation would be more robust.
  if (location.toLowerCase().includes('san francisco'))
    return { lat: 37.7749, lng: -122.4194 };
  if (location.toLowerCase().includes('oakland'))
    return { lat: 37.8044, lng: -122.2712 };
  if (location.toLowerCase().includes('new york'))
    return { lat: 40.7128, lng: -74.006 };
  if (location.toLowerCase().includes('chicago'))
    return { lat: 41.8781, lng: -87.6298 };
  // Add more mock locations as needed
  return null;
};

export default function MapView({ jobs }: MapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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
      center={jobLocations.length > 0 ? jobLocations[0].position : center}
      zoom={jobLocations.length > 0 ? 10 : 4}
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
