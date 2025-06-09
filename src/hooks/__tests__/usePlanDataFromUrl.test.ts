import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePlanDataFromUrl } from '../usePlanDataFromUrl';
import { generateShareableString } from '@/services/planSharingService';
import type { UserAppState } from '@/types';
import { vi } from 'vitest';

// Mock useLocation from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn()
  };
});

import { useLocation } from 'react-router-dom';
const mockUseLocation = useLocation as any;

describe('usePlanDataFromUrl', () => {
  const mockPlanState: UserAppState = {
    activePlanInternalName: 'Test Plan',
    initialAssets: [],
    scenarios: [],
    selectedScenarioIds: [],
    userQualitativeGoals: [],
  };

  beforeEach(() => {
    // Reset the mock before each test
    mockUseLocation.mockReturnValue({
      search: '',
      pathname: '/',
      hash: '',
      state: null,
      key: 'default'
    });
  });

  it('should return null when no planData parameter is present', () => {
    mockUseLocation.mockReturnValue({
      search: '',
      pathname: '/',
      hash: '',
      state: null,
      key: 'default'
    });

    const { result } = renderHook(() => usePlanDataFromUrl());
    expect(result.current).toBeNull();
  });

  it('should parse valid planData from URL', async () => {
    const encodedData = generateShareableString(mockPlanState);
    mockUseLocation.mockReturnValue({
      search: `?planData=${encodedData}`,
      pathname: '/',
      hash: '',
      state: null,
      key: 'default'
    });
    
    const { result } = renderHook(() => usePlanDataFromUrl());
    await waitFor(() => {
      expect(result.current).toBeTruthy();
      expect(result.current?.activePlanInternalName).toBe(mockPlanState.activePlanInternalName);
    });
  });

  it('should return null for invalid planData', () => {
    mockUseLocation.mockReturnValue({
      search: '?planData=invalid-data',
      pathname: '/',
      hash: '',
      state: null,
      key: 'default'
    });

    const { result } = renderHook(() => usePlanDataFromUrl());
    expect(result.current).toBeNull();
  });
}); 