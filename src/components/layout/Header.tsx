import { Share2 } from 'lucide-react';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { UserAppState } from '@/types';

export function Header() {
  const activePlanInternalName = useUserAppState((state: UserAppState) => state.activePlanInternalName);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40">
      <div className="h-full flex items-center px-4">
        <div className="w-1/4">
          <h1 className="text-xl font-semibold text-foreground">Tax Scenarios</h1>
        </div>
        <div className="flex-1 text-center">
          <div className="text-sm text-muted-foreground">
            {activePlanInternalName}
          </div>
        </div>
        <div className="w-1/4 flex justify-end">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
} 