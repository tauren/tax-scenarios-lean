import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { UserAppState } from '@/types';
import { generateShareableString } from '@/services/planSharingService';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SharePlanDialog } from '@/components/dialogs/SharePlanDialog';
import { DevTools } from '@/components/dev/DevTools';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [overviewUrl, setOverviewUrl] = useState('');
  const [deepLinkUrl, setDeepLinkUrl] = useState('');
  const [currentPageName, setCurrentPageName] = useState('');
  const [isOverviewTypePage, setIsOverviewTypePage] = useState(false);
  const activePlanInternalName = useUserAppState((state: UserAppState) => state.activePlanInternalName);
  const state = useUserAppState((state: UserAppState) => state);

  // Helper function to get human-readable page name
  const getPageName = (pathname: string): string => {
    if (pathname === '/' || pathname === '/overview') return 'Overview';
    if (pathname.includes('/scenarios') && pathname.includes('/edit')) return 'Scenario Edit';
    if (pathname.includes('/scenarios')) return 'Scenarios';
    if (pathname.includes('/assets')) return 'Assets';
    if (pathname.includes('/expenses')) return 'Expenses';
    if (pathname.includes('/results')) return 'Results';
    if (pathname.includes('/goals')) return 'Goals';
    return 'Current Page';
  };

  // Helper function to check if current page is an overview-type page
  const isOverviewType = (pathname: string): boolean => {
    return pathname === '/' || pathname === '/overview';
  };

  const handleShare = () => {
    const shareableString = generateShareableString(state);
    if (shareableString) {
      try {
        // Generate overview URL (always goes to /overview)
        const overviewLink = `${window.location.origin}/overview?planData=${shareableString}`;
        
        // Generate deep link URL (preserves current path)
        const deepLink = `${window.location.origin}${window.location.pathname}?planData=${shareableString}`;
        
        // Get current page name and determine if it's an overview-type page
        const pageName = getPageName(location.pathname);
        const isOverviewPage = isOverviewType(location.pathname);
        
        setOverviewUrl(overviewLink);
        setDeepLinkUrl(deepLink);
        setCurrentPageName(pageName);
        setIsOverviewTypePage(isOverviewPage);
        setIsShareDialogOpen(true);
        
        // Automatically copy overview URL to clipboard (default behavior)
        navigator.clipboard.writeText(overviewLink)
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
          <DevTools />
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <SharePlanDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        overviewUrl={overviewUrl}
        deepLinkUrl={deepLinkUrl}
        currentPageName={currentPageName}
        isOverviewTypePage={isOverviewTypePage}
      />
    </header>
  );
} 