import { useState, useEffect } from 'react';
import type { UserAppState } from '@/types';

export function useAppState() {
  const [state, setState] = useState<UserAppState | null>(null);

  // Load state from localStorage or other source here
  useEffect(() => {
    // Example: Load state from localStorage
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        setState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  return { state, setState };
} 