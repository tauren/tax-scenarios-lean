import { useState, useEffect } from 'react';
import type { Asset } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<Asset, 'id'>) => void;
  asset?: Asset | null;
}

const initialFormData: Omit<Asset, 'id'> = {
  name: '',
  quantity: 0,
  costBasisPerUnit: 0,
  acquisitionDate: new Date(),
  assetType: '',
  fmvPerUnit: 0,
};

export function AssetDialog({ isOpen, onClose, onSave, asset }: AssetDialogProps) {
  const [formData, setFormData] = useState<Omit<Asset, 'id'>>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        quantity: asset.quantity,
        costBasisPerUnit: asset.costBasisPerUnit,
        acquisitionDate: asset.acquisitionDate,
        assetType: asset.assetType || '',
        fmvPerUnit: asset.fmvPerUnit || 0,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [asset, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const value = e.target.value;
    if (value === '') {
      setFormData(prev => ({ ...prev, [field]: '' }));
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {asset ? (asset.id ? 'Edit Asset' : 'Duplicate Asset') : 'Add New Asset'}
          </DialogTitle>
          <DialogDescription>
            {asset ? (asset.id ? 'Update the details of your existing asset.' : 'Create a copy of this asset with new details.') : 'Add a new asset to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset-name">Name</Label>
            <Input
              id="asset-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-type">Asset Type</Label>
            <Select
              value={formData.assetType}
              onValueChange={(value) => setFormData({ ...formData, assetType: value })}
            >
              <SelectTrigger id="asset-type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-quantity">Quantity</Label>
            <Input
              id="asset-quantity"
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={(e) => handleNumberInput(e, 'quantity')}
              min="0"
              step="0.00000001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-cost-basis">Cost Basis per Unit</Label>
            <Input
              id="asset-cost-basis"
              type="number"
              value={formData.costBasisPerUnit === 0 ? '' : formData.costBasisPerUnit}
              onChange={(e) => handleNumberInput(e, 'costBasisPerUnit')}
              min="0"
              step="0.00000001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-acquisition-date">Acquisition Date</Label>
            <Input
              id="asset-acquisition-date"
              type="date"
              value={formData.acquisitionDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, acquisitionDate: new Date(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-fmv">FMV per Unit (Optional)</Label>
            <Input
              id="asset-fmv"
              type="number"
              value={formData.fmvPerUnit === 0 ? '' : formData.fmvPerUnit}
              onChange={(e) => handleNumberInput(e, 'fmvPerUnit')}
              min="0"
              step="0.00000001"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {asset ? (asset.id ? 'Save Changes' : 'Create Copy') : 'Add Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 