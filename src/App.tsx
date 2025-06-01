import { Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { useEffect } from 'react';
import { usePlanDataFromUrl } from '@/hooks/usePlanDataFromUrl';
import { useUserAppState } from '@/store/userAppStateSlice';

export function App() {
  const planData = usePlanDataFromUrl();
  const setAppState = useUserAppState((state) => state.setAppState);

  useEffect(() => {
    if (planData) {
      setAppState(planData);
      // Optionally, remove planData from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('planData');
      window.history.replaceState({}, '', url.toString());
    }
  }, [planData, setAppState]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
