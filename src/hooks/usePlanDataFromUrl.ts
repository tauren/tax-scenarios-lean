import { useEffect, useState } from 'react';
import { parseShareableString } from '@/services/planSharingService';
import type { UserAppState } from '@/types';

/**
 * Hook to parse plan data from URL parameters
 * @returns The parsed plan data if present and valid, null otherwise
 */
export function usePlanDataFromUrl(): UserAppState | null {
  const [planData, setPlanData] = useState<UserAppState | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get('planData');
      if (encodedData) {
        const parsedData = parseShareableString(encodedData);
        setPlanData(parsedData);
      }
    } catch (error) {
      console.error('Error parsing plan data from URL:', error);
      setPlanData(null);
    }
  }, []); // Only run on mount

  return planData;
} 