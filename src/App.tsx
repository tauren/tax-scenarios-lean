import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { usePlanDataFromUrl } from '@/hooks/usePlanDataFromUrl';
import { useUserAppState } from '@/store/userAppStateSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from 'sonner';
import { toast } from 'sonner';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);
  const [pendingPlanData, setPendingPlanData] = useState<any>(null);
  const processedUrlRef = useRef<string | null>(null);

  const planData = usePlanDataFromUrl();

  // Zustand state management for the active plan
  // Use two hook calls instead of one. This prevents infinite re-renders 
  // due to a new object being created on every render
  const setAppState = useUserAppState((state) => state.setAppState);
  const activePlanInternalName = useUserAppState((state) => state.activePlanInternalName);
  const loadAndMigrateState = useUserAppState(state => state.loadAndMigrateState);

  // Add a development-only migration trigger
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (e: KeyboardEvent) => {
        // Press Ctrl+Shift+M to trigger migration
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
          console.log('Triggering manual migration...');
          loadAndMigrateState();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [loadAndMigrateState]);

  // Handle route protection
  useEffect(() => {
    if (location.pathname === '/') return;
    
    // Don't redirect if we're currently processing plan data from URL
    if (planData) return;
    
    if (!activePlanInternalName) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, activePlanInternalName, navigate, planData]);

  // Handle plan loading
  useEffect(() => {
    if (!planData) return;

    // Get current URL search to create a unique key for this plan data
    const currentUrl = location.search;
    
    // Prevent processing the same URL data multiple times
    if (processedUrlRef.current === currentUrl) {
      return;
    }

    // Clear URL parameters immediately to prevent re-triggering
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('planData');
    setSearchParams(newParams, { replace: true });

    // Get current store state at the time of processing
    const currentState = useUserAppState.getState();
    
    // Check if there's actually meaningful existing data
    // Empty plan or just default values shouldn't trigger overwrite dialog
    const hasSignificantData = currentState.activePlanInternalName && 
      currentState.activePlanInternalName !== '' && 
      currentState.activePlanInternalName !== 'Untitled Plan';

    // Mark this URL as processed
    processedUrlRef.current = currentUrl;

    if (!hasSignificantData) {
      // No meaningful data, load immediately
      setAppState(planData);
      
      // Show contextual toast if landing on non-overview page from shared link
      if (location.pathname !== '/' && location.pathname !== '/overview') {
        // Use setTimeout to ensure the toast shows after navigation
        setTimeout(() => {
          toast.info("You're viewing a shared plan section. Click 'Overview' in the navigation to see the full plan.", {
            duration: 6000,
            action: {
              label: 'Go to Overview',
              onClick: () => navigate('/overview')
            }
          });
        }, 500);
      }
      
      // Navigate to the current path (preserving deep link) or overview if on home
      if (location.pathname === '/') {
        navigate('/overview', { replace: true });
      }
    } else {
      // Meaningful data exists, show dialog
      setPendingPlanData(planData);
      setIsOverwriteDialogOpen(true);
    }
  }, [planData, navigate, setAppState, searchParams, setSearchParams, location.search]);

  const handleConfirmOverwrite = () => {
    if (!pendingPlanData) return;
    
    // Update state and navigate
    setAppState(pendingPlanData);
    
    // Show contextual toast if landing on non-overview page from shared link
    if (location.pathname !== '/' && location.pathname !== '/overview') {
      // Use setTimeout to ensure the toast shows after state update
      setTimeout(() => {
        toast.info("You're viewing a sub-section of a shared comparison. Click 'Overview' in the navigation to see the full comparison.", {
          duration: 6000,
          action: {
            label: 'Go to Overview',
            onClick: () => navigate('/overview')
          }
        });
      }, 500);
    }
    
    // Navigate to the current path (preserving deep link) or overview if on home
    if (location.pathname === '/') {
      navigate('/overview', { replace: true });
    }
    
    // Reset state
    setPendingPlanData(null);
    setIsOverwriteDialogOpen(false);
  };

  const handleCancelOverwrite = () => {
    // Reset state
    setPendingPlanData(null);
    setIsOverwriteDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancelOverwrite();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster />

      <AlertDialog 
        open={isOverwriteDialogOpen} 
        onOpenChange={handleOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite Existing Comparison</AlertDialogTitle>
            <AlertDialogDescription>
              You already have a comparison saved. Loading a new comparison will overwrite your existing comparison.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelOverwrite}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOverwrite}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
