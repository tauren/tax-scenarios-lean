import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useUserAppState } from '@/store/userAppStateSlice';
import { cn } from "@/lib/utils"
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  isCurrentPage?: boolean;
}

export function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activePlanInternalName, scenarios } = useUserAppState();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    // Always add the plan name as the first item if we have one
    if (activePlanInternalName) {
      items.push({
        label: activePlanInternalName,
        path: '/overview',
      });
    }

    // Add the current section
    if (pathSegments[0] === 'overview') {
      items.push({
        label: 'Overview',
        isCurrentPage: true,
      });
    } else if (pathSegments[0] === 'scenarios') {
      items.push({
        label: 'Scenarios',
        path: '/scenarios',
      });

      // If we're creating a new scenario
      if (pathSegments[1] === 'new') {
        items.push({
          label: 'Create New',
          path: '/scenarios/new',
        });
      }
      // If we're editing a scenario
      else if (pathSegments[1] && pathSegments[2] === 'edit') {
        const scenario = scenarios.find(s => s.id === pathSegments[1]);
        if (scenario) {
          items.push({
            label: scenario.name,
            path: `/scenarios/${pathSegments[1]}`,
          });
        }
        items.push({
          label: 'Edit Scenario',
          path: `/scenarios/${pathSegments[1]}/edit`,
        });
      }
      // If we're viewing a scenario
      else if (pathSegments[1] && !pathSegments[2]) {
        const scenario = scenarios.find(s => s.id === pathSegments[1]);
        items.push({
          label: scenario?.name || 'View Scenario',
          path: `/scenarios/${pathSegments[1]}`,
        });
      }
    } else if (pathSegments[0] === 'assets') {
      items.push({
        label: 'Assets',
        isCurrentPage: true,
      });
    } else if (pathSegments[0] === 'objectives') {
      items.push({
        label: 'Location Objectives',
        isCurrentPage: true,
      });
    }

    return items;
  };

  const items = getBreadcrumbItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.path ? (
            <Link
              to={item.path}
              className={cn(
                "hover:text-primary transition-colors",
                item.isCurrentPage && "text-foreground font-medium"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "text-foreground",
              item.isCurrentPage && "font-medium"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
} 