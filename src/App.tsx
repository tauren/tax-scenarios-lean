import { useTraceUpdate } from '@/hooks/useTraceUpdate'; // Import the new hook

import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
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

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Clean, declarative state to control the dialog's visibility
  const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);

  // Custom hook to parse plan data from the URL
  const planData = usePlanDataFromUrl();

  // Zustand state management for the active plan
  // Use two hook calls instead of one. This prevents infinite re-renders 
  // due to a new object being created on every render
  const setAppState = useUserAppState((state) => state.setAppState);
  const activePlanInternalName = useUserAppState((state) => state.activePlanInternalName);
  console.log("Active plan internal name:", activePlanInternalName);

  // Add route protection for when no active plan exists
  useEffect(() => {
    // If we're already on the home page, no need to redirect
    if (location.pathname === '/') {
      return;
    }

    // If there's no active plan, redirect to home
    if (!activePlanInternalName) {
      console.log("No active plan found, redirecting to home...");
      navigate('/', { replace: true });
    }
  }, [location.pathname, activePlanInternalName, navigate]);

  // Handles loading from shareable links with overwrite protection.
  useEffect(() => {
    // If there's no plan data in the URL, there's nothing to do.
    if (!planData) {
      return;
    }

    // SCENARIO 1: AUTO-LOAD (no active plan)
    // If there is planData, but no active plan in the app, load it immediately.
    if (!activePlanInternalName) {
      console.log("Auto-loading plan from URL...");
      clearActivePlanFromStorage(); // Good practice to clear old remnants
      setAppState(planData);
      navigate('/scenarios', { replace: true });
      return; // Stop the effect here
    }

    // SCENARIO 2: OVERWRITE PROMPT
    // If there is planData AND an active plan, show the overwrite dialog.
    if (activePlanInternalName && activePlanInternalName !== planData.activePlanInternalName) {
      console.log("Prompting to overwrite existing plan...");
      setIsOverwriteDialogOpen(true);
    }
}, [planData, activePlanInternalName, navigate, setAppState]);
  
  // Add this right after all your hooks
  useTraceUpdate({ planData, activePlanInternalName, isOverwriteDialogOpen, searchParams });

  /** "Yes, Continue" action: Overwrites the plan and redirects. */
  const handleConfirmOverwrite = () => {
    if (planData) {
      clearActivePlanFromStorage();
      setAppState(planData);
      navigate('/scenarios', { replace: true });
    }
    setIsOverwriteDialogOpen(false); // Close dialog
  };

  /** "No, Cancel" action: Removes the query string and stays on the current page. */
  const handleCancelOverwrite = () => {
    // Create a mutable copy of the current search params.
    const newParams = new URLSearchParams(searchParams);
    // Remove the specific parameter.
    newParams.delete('planData');
    // Use the setter from the hook to update the URL.
    setSearchParams(newParams, { replace: true });
    // Close dialog
    setIsOverwriteDialogOpen(false); 
  };

  /** Handles dialog close from overlay click or Escape key, treating it as a cancel. */
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
          <Outlet />
        </div>
      </main>
      <Footer />

      <AlertDialog open={isOverwriteDialogOpen} onOpenChange={handleOpenChange}>
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
            <AlertDialogAction onClick={handleConfirmOverwrite}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
