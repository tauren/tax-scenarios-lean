import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { isCompressionEnabled, setCompressionEnabled } from '@/services/localStorageService';
import { useEffect, useState } from 'react';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { UserAppState } from '@/types';
import { generateShareableString } from '@/services/planSharingService';
import { Link, useNavigate } from 'react-router-dom';
import { SharePlanDialog } from '@/components/dialogs/SharePlanDialog';

export function Header() {
  const navigate = useNavigate();
  const [compressionEnabled, setCompressionEnabledState] = useState(isCompressionEnabled());
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const activePlanInternalName = useUserAppState((state: UserAppState) => state.activePlanInternalName);
  const state = useUserAppState((state: UserAppState) => state);

  useEffect(() => {
    setCompressionEnabledState(isCompressionEnabled());
  }, []);

  const toggleCompression = () => {
    const willEnable = !isCompressionEnabled();
    setCompressionEnabled(willEnable);
    setCompressionEnabledState(willEnable);
    window.location.reload(); // Reload to apply new compression setting
  };

  const handleShare = () => {
    const shareableString = generateShareableString(state);
    if (shareableString) {
      try {
        const url = `${window.location.origin}${window.location.pathname}?planData=${shareableString}`;
        setShareableUrl(url);
        setIsShareDialogOpen(true);
        // Automatically copy to clipboard
        navigator.clipboard.writeText(url)
          .catch(err => console.error('Failed to copy URL:', err));
      } catch (error) {
        console.error('Error generating shareable URL:', error);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40">
      <div className="h-full flex items-center px-4">
        <div className="w-1/4">
          <Link to="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
            Tax Scenarios
          </Link>
        </div>
        <div className="flex-1 text-center">
          {activePlanInternalName && (
            <button
              onClick={() => navigate('/overview')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {activePlanInternalName}
            </button>
          )}
        </div>
        <div className="w-1/4 flex justify-end items-center space-x-2">
          <Button variant="outline" onClick={toggleCompression}>
            {compressionEnabled ? 'Disable Compression' : 'Enable Compression'}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <SharePlanDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        shareableUrl={shareableUrl}
      />
    </header>
  );
} 