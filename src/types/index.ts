export interface UserAppState {
  activePlanInternalName: string;
}

export interface UserAppStateSlice extends UserAppState {
  setActivePlanInternalName: (name: string) => void;
} 