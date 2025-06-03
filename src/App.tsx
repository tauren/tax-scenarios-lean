import { Outlet, useNavigate, useLocation, useSearchParams, replace } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { useEffect } from 'react';
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
import { clearActivePlanFromStorage, loadActivePlanFromStorage } from '@/services/localStorageService';

export function App() {
  const planData = usePlanDataFromUrl();
  const setAppState = useUserAppState((state) => state.setAppState);
  const activePlanInternalName = useUserAppState((state) => state.activePlanInternalName);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle plan data loading
  useEffect(() => {
    // Skip if no plan data or not on root path
    if (!planData || location.pathname !== '/') {
      return;
    }

    // If no existing plan, load directly
    if (!activePlanInternalName) {
      clearActivePlanFromStorage(); // Clear any existing data
      setAppState(planData);
      navigate('/scenarios', { replace: true });
    }
  }, [planData, location.pathname, activePlanInternalName]);

  const handleConfirmLoad = () => {
    if (planData) {
      clearActivePlanFromStorage();
      setAppState(planData);
      navigate('/scenarios', { replace: true });
    }
  };

  const handleCancelLoad = () => {
    // const params = new URLSearchParams(location.search);
    const params = new URLSearchParams(searchParams);
    params.delete('planData');
    setSearchParams(params, {replace:true})
    // navigate(`${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  };

  // Compute dialog visibility based on conditions
  const shouldShowDialog = Boolean(
    planData && 
    location.pathname === '/' && 
    loadActivePlanFromStorage()?.activePlanInternalName
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />

      <AlertDialog 
        open={shouldShowDialog} 
        onOpenChange={(open) => {
          if (!open) {
            handleCancelLoad();
          }
        }}
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
            <AlertDialogCancel onClick={handleCancelLoad}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLoad}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
