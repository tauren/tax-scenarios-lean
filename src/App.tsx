import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { clearActivePlanFromStorage } from '@/services/localStorageService';
import { Toaster } from 'sonner';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);
  const [pendingPlanData, setPendingPlanData] = useState<any>(null);

  const planData = usePlanDataFromUrl();

  // Zustand state management for the active plan
  // Use two hook calls instead of one. This prevents infinite re-renders 
  // due to a new object being created on every render
  const setAppState = useUserAppState((state) => state.setAppState);
  const activePlanInternalName = useUserAppState((state) => state.activePlanInternalName);

  // Handle route protection
  useEffect(() => {
    if (location.pathname === '/') return;
    if (!activePlanInternalName) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, activePlanInternalName, navigate]);

  // Handle plan loading
  useEffect(() => {
    if (!planData) return;

    // Clear URL parameters immediately to prevent re-triggering
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('planData');
    setSearchParams(newParams, { replace: true });

    if (!activePlanInternalName) {
      // No active plan, load immediately
      clearActivePlanFromStorage();
      setAppState(planData);
      navigate('/overview', { replace: true });
    } else {
      // Active plan exists, show dialog
      setPendingPlanData(planData);
      setIsOverwriteDialogOpen(true);
    }
  }, [planData, activePlanInternalName, navigate, setAppState, searchParams, setSearchParams]);

  const handleConfirmOverwrite = () => {
    if (!pendingPlanData) return;
    
    // Update state and navigate
    clearActivePlanFromStorage();
    setAppState(pendingPlanData);
    navigate('/overview', { replace: true });
    
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
            <AlertDialogTitle>Overwrite Existing Plan</AlertDialogTitle>
            <AlertDialogDescription>
              You already have a plan saved. Loading a new plan will overwrite your existing plan.
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
