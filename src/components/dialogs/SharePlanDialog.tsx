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
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SharePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareableUrl: string;
}

export function SharePlanDialog({ isOpen, onClose, shareableUrl }: SharePlanDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);

  // Copy URL when dialog opens
  useEffect(() => {
    if (isOpen) {
      handleCopy();
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setHasCopied(true);
      toast.success('URL copied to clipboard');
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast.error('Failed to copy URL to clipboard');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share Your Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Copy the URL below to share your plan with others. Anyone with this link can view and load your plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            readOnly
            value={shareableUrl}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0"
          >
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 