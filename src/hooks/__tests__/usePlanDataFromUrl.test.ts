import { renderHook, waitFor } from '@testing-library/react';
import { usePlanDataFromUrl } from '../usePlanDataFromUrl';
import { generateShareableString } from '@/services/planSharingService';
import type { UserAppState } from '@/types';

// TODO: Fix this test
describe.skip('usePlanDataFromUrl', () => {
  const mockPlanState: UserAppState = {
    activePlanInternalName: 'Test Plan',
    initialAssets: [],
    scenarios: [],
  };

  beforeEach(() => {
    // Reset window.location.search before each test
    window.history.pushState({}, '', 'http://localhost/');
  });

  it('should return null when no planData parameter is present', () => {
    const { result } = renderHook(() => usePlanDataFromUrl());
    expect(result.current).toBeNull();
  });

  it('should parse valid planData from URL', async () => {
    const encodedData = generateShareableString(mockPlanState);
    window.history.pushState({}, '', `http://localhost/?planData=${encodedData}`);
    // Render after setting the URL
    const { result } = renderHook(() => usePlanDataFromUrl());
    await waitFor(() => {
      expect(result.current).toBeTruthy();
      expect(result.current?.activePlanInternalName).toBe(mockPlanState.activePlanInternalName);
    });
  });

  it('should return null for invalid planData', () => {
    window.history.pushState({}, '', 'http://localhost/?planData=invalid-data');
    const { result } = renderHook(() => usePlanDataFromUrl());
    expect(result.current).toBeNull();
  });
}); 