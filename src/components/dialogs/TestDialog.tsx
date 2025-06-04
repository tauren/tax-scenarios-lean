import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/form-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

type DialogMode = 'add' | 'edit' | 'duplicate';

interface TestItem {
  id: string;
  name: string;
}

interface TestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: TestItem;
  mode?: DialogMode;
  onSave: (item: TestItem) => void;
}

export function TestDialog({
  open,
  onOpenChange,
  item,
  mode = 'add',
  onSave,
}: TestDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName(item?.name || '');
      setError(undefined);
    }
  }, [open, item]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    onSave({
      id: item?.id || crypto.randomUUID(),
      name: name.trim(),
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add Test Item';
      case 'edit':
        return 'Edit Test Item';
      case 'duplicate':
        return 'Duplicate Test Item';
      default:
        return 'Test Item';
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case 'add':
        return 'Add a new test item.';
      case 'edit':
        return 'Update the details of this test item.';
      case 'duplicate':
        return 'Create a copy of this test item with a new name.';
      default:
        return '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormField
            id="name"
            label="Name"
            error={error}
          >
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className={error ? 'border-destructive' : ''}
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {mode === 'add' ? 'Add Item' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 