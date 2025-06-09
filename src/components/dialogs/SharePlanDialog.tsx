import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, ExternalLink, Home } from 'lucide-react';
import { toast } from 'sonner';

interface SharePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  overviewUrl: string;
  deepLinkUrl: string;
  currentPageName: string;
  isOverviewTypePage: boolean;
}

export function SharePlanDialog({ isOpen, onClose, overviewUrl, deepLinkUrl, currentPageName, isOverviewTypePage }: SharePlanDialogProps) {
  const [hasCopiedOverview, setHasCopiedOverview] = useState(false);
  const [hasCopiedDeepLink, setHasCopiedDeepLink] = useState(false);

  // Copy overview URL when dialog opens (default behavior)
  useEffect(() => {
    if (isOpen) {
      handleCopyOverview();
    }
  }, [isOpen, overviewUrl]);

  const handleCopyOverview = async () => {
    try {
      await navigator.clipboard.writeText(overviewUrl);
      setHasCopiedOverview(true);
      toast.success(isOverviewTypePage ? 'Plan link copied to clipboard' : 'Overview link copied to clipboard');
      setTimeout(() => setHasCopiedOverview(false), 2000);
    } catch (err) {
      console.error('Failed to copy overview URL:', err);
      toast.error('Failed to copy URL to clipboard');
    }
  };

  const handleCopyDeepLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLinkUrl);
      setHasCopiedDeepLink(true);
      toast.success('Deep link copied to clipboard');
      setTimeout(() => setHasCopiedDeepLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy deep link URL:', err);
      toast.error('Failed to copy URL to clipboard');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isOverviewTypePage ? "max-w-xl" : "max-w-2xl"}>
        <AlertDialogHeader>
          <AlertDialogTitle>Share Your Plan</AlertDialogTitle>
          <AlertDialogDescription>
            {isOverviewTypePage 
              ? "Copy the link below to share your plan with others. Anyone with this link can view and load your plan."
              : "Choose how you want to share your plan. The overview link takes recipients to the main plan page, while the deep link takes them directly to this specific page."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          {isOverviewTypePage ? (
            /* Single link section when on overview-type page */
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Share Plan</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Recipients will be taken to the plan overview page.
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={overviewUrl}
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyOverview}
                  className="shrink-0"
                >
                  {hasCopiedOverview ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Link - Default */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Plan Overview (Recommended)</h4>
                  <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">Default</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Best for sharing the full plan. Recipients will see the overview page first.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={overviewUrl}
                    className="flex-1 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyOverview}
                    className="shrink-0"
                  >
                    {hasCopiedOverview ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Deep Link */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium">Direct Link to {currentPageName}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Takes recipients directly to this specific page. Useful for focused discussions.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={deepLinkUrl}
                    className="flex-1 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyDeepLink}
                    className="shrink-0"
                  >
                    {hasCopiedDeepLink ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 