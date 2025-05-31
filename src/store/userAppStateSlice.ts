import { create } from 'zustand';
import type { UserAppStateSlice, Asset } from '@/types';

export const useUserAppState = create<UserAppStateSlice>((set) => ({
  activePlanInternalName: 'Untitled Plan',
  initialAssets: [],

  setActivePlanInternalName: (name: string) =>
    set((state) => ({ ...state, activePlanInternalName: name })),

  addAsset: (asset: Asset) =>
    set((state) => ({ ...state, initialAssets: [...state.initialAssets, asset] })),

  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) =>
    set((state) => ({
      ...state,
      initialAssets: state.initialAssets.map((asset) =>
        asset.id === assetId ? { ...asset, ...updatedAsset } : asset
      ),
    })),

  deleteAsset: (assetId: string) =>
    set((state) => ({
      ...state,
      initialAssets: state.initialAssets.filter((asset) => asset.id !== assetId),
    })),
})); 