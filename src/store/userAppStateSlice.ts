import { create } from 'zustand';
import type { UserAppStateSlice } from '../types';

export const useUserAppState = create<UserAppStateSlice>((set) => ({
  activePlanInternalName: 'Untitled Plan',
  setActivePlanInternalName: (name: string) => set({ activePlanInternalName: name }),
})); 