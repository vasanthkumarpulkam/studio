

'use client';

import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useGoogleMaps } from '@/context/google-maps-provider';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (value: string) => void;
  value: string;
}

export default function AutocompleteInput({ onValueChange, value, className, ...props }: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, apiKeyMissing } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'], // You can customize this
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          onValueChange(place.formatted_address);
        } else if (place.name) {
          onValueChange(place.name);
        }
      });
    }
  }, [isLoaded, onValueChange]);

  if (apiKeyMissing) {
    return (
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn("w-full rounded-lg bg-background", className)}
        disabled
        placeholder="Add Maps API Key to enable"
        {...props}
      />
    )
  }

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn("w-full rounded-lg bg-background", className)}
      {...props}
    />
  );
}
