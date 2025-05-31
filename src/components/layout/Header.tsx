import { useUserAppState } from '../../store/userAppStateSlice';
import type { UserAppState } from '../../types';

export function Header() {
  const activePlanInternalName = useUserAppState((state: UserAppState) => state.activePlanInternalName);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 h-16 bg-white border-b border-border">
      <div className="h-full flex items-center px-4">
        <div className="w-1/4">
          <h1 className="text-lg font-semibold">Tax Scenarios Analyzer</h1>
        </div>
        <div className="flex-1 text-center">
          <div className="text-sm text-muted-foreground">
            {activePlanInternalName}
          </div>
        </div>
        <div className="w-1/4 flex justify-end">
          <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
            Share
          </button>
        </div>
      </div>
    </header>
  );
} 