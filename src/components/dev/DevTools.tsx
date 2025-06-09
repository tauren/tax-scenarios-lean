import { Button } from '@/components/ui/button';
import { isStagewiseEnabled, setStagewiseEnabled } from '@/services/stagewiseService';
import { useEffect, useState } from 'react';

export function DevTools() {
  const [stagewiseEnabled, setStagewiseEnabledState] = useState(isStagewiseEnabled());

  useEffect(() => {
    setStagewiseEnabledState(isStagewiseEnabled());
  }, []);

  const toggleStagewise = () => {
    const willEnable = !isStagewiseEnabled();
    setStagewiseEnabled(willEnable);
    setStagewiseEnabledState(willEnable);
    window.location.reload(); // Reload to apply new Stagewise setting
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" onClick={toggleStagewise}>
        {stagewiseEnabled ? 'Disable Stagewise' : 'Enable Stagewise'}
      </Button>
    </div>
  );
} 