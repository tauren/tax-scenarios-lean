export interface UserAppState {
  activePlanInternalName: string;
  initialAssets: Asset[];
}

export interface UserAppStateSlice extends UserAppState {
  setActivePlanInternalName: (name: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => void;
  deleteAsset: (assetId: string) => void;
}

export interface Asset {
  id: string;
  name: string;
  quantity: number;
  costBasisPerUnit: number;
  acquisitionDate: Date;
  assetType?: string;
  fmvPerUnit?: number;
} 