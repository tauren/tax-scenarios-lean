import { useRef } from 'react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetName: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  assetName,
}: DeleteConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="bg-background rounded-lg shadow-lg border border-border p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Delete Asset</h2>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete "{assetName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-foreground hover:bg-muted border border-border rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-foreground text-background border border-border rounded hover:bg-muted transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 