import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { isCompressionEnabled, setCompressionEnabled } from '@/services/localStorageService';
import { useEffect, useState } from 'react';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { UserAppState } from '@/types';

export function Header() {
  const [compressionEnabled, setCompressionEnabledState] = useState(isCompressionEnabled());
  const activePlanInternalName = useUserAppState((state: UserAppState) => state.activePlanInternalName);

  useEffect(() => {
    setCompressionEnabledState(isCompressionEnabled());
  }, []);

  const toggleCompression = () => {
    const willEnable = !isCompressionEnabled();
    setCompressionEnabled(willEnable);
    setCompressionEnabledState(willEnable);
    window.location.reload(); // Reload to apply new compression setting
  };

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
        <div className="w-1/4 flex justify-end items-center space-x-2">
          <Button variant="outline" onClick={toggleCompression}>
            {compressionEnabled ? 'Disable Compression' : 'Enable Compression'}
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
} 