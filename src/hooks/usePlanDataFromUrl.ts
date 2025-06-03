import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { parseShareableString } from '@/services/planSharingService';
import type { UserAppState } from '@/types';


/**
 * Hook to parse plan data from URL parameters
 * @returns The parsed plan data if present and valid, null otherwise
 */
export function usePlanDataFromUrl(): UserAppState | null {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const encodedData = params.get('planData');

  // useMemo will only re-run the parsing logic when 'encodedData' changes.
  // This prevents creating a new object on every render, fixing the infinite loop.
  return useMemo(() => {
    if (!encodedData) {
      return null;
    }

    try {
      return parseShareableString(encodedData);
    } catch (error) {
      console.error('Error parsing plan data from URL:', error);
      return null;
    }
  }, [encodedData]); 
} 