import { useState, useEffect, useRef } from 'react';
import type { Asset } from '../../types';

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
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div 
        ref={dialogRef}
        className="bg-background rounded-lg p-6 w-full max-w-md border border-border"
      >
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {asset ? (asset.id ? 'Edit Asset' : 'Duplicate Asset') : 'Add New Asset'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Asset Type</label>
            <select
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
            >
              <option value="">Select a type</option>
              <option value="stock">Stock</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="real-estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Quantity</label>
            <input
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={(e) => handleNumberInput(e, 'quantity')}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              min="0"
              step="0.00000001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Cost Basis per Unit</label>
            <input
              type="number"
              value={formData.costBasisPerUnit === 0 ? '' : formData.costBasisPerUnit}
              onChange={(e) => handleNumberInput(e, 'costBasisPerUnit')}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              min="0"
              step="0.00000001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Acquisition Date</label>
            <input
              type="date"
              value={formData.acquisitionDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, acquisitionDate: new Date(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">FMV per Unit (Optional)</label>
            <input
              type="number"
              value={formData.fmvPerUnit === 0 ? '' : formData.fmvPerUnit}
              onChange={(e) => handleNumberInput(e, 'fmvPerUnit')}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              min="0"
              step="0.00000001"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-muted border border-border rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-foreground text-background border border-border rounded hover:bg-muted transition-colors"
            >
              {asset ? (asset.id ? 'Save Changes' : 'Create Copy') : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 