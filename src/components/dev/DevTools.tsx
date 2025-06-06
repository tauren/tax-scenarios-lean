import { Button } from '@/components/ui/button';
import { isCompressionEnabled, setCompressionEnabled } from '@/services/localStorageService';
import { isStagewiseEnabled, setStagewiseEnabled } from '@/services/stagewiseService';
import { useEffect, useState } from 'react';

export function DevTools() {
  const [compressionEnabled, setCompressionEnabledState] = useState(isCompressionEnabled());
  const [stagewiseEnabled, setStagewiseEnabledState] = useState(isStagewiseEnabled());

  useEffect(() => {
    setCompressionEnabledState(isCompressionEnabled());
    setStagewiseEnabledState(isStagewiseEnabled());
  }, []);

  const toggleCompression = () => {
    const willEnable = !isCompressionEnabled();
    setCompressionEnabled(willEnable);
    setCompressionEnabledState(willEnable);
    window.location.reload(); // Reload to apply new compression setting
  };

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
      <Button variant="outline" onClick={toggleCompression}>
        {compressionEnabled ? 'Disable Compression' : 'Enable Compression'}
      </Button>
    </div>
  );
} 