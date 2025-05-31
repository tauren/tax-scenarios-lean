import { useState } from 'react';
import { useUserAppState } from '../../store/userAppStateSlice';
import type { Asset } from '../../types';
import { AssetDialog } from '../dialogs/AssetDialog';
import { DeleteConfirmationDialog } from '../dialogs/DeleteConfirmationDialog';
import { v4 as uuidv4 } from 'uuid';
import { formatAssetType } from '../../utils/formatting';

export function AssetManagementView() {
  const { initialAssets, addAsset, updateAsset, deleteAsset } = useUserAppState();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleSaveAsset = (assetData: Omit<Asset, 'id'>) => {
    if (selectedAsset?.id) {
      updateAsset(selectedAsset.id, assetData);
    } else {
      addAsset({ ...assetData, id: uuidv4() });
    }
  };

  const handleDeleteAsset = () => {
    if (selectedAsset) {
      deleteAsset(selectedAsset.id);
    }
  };

  const handleDuplicateAsset = (asset: Asset) => {
    const { id, ...assetData } = asset;
    setSelectedAsset({ ...assetData, id: '' } as Asset);
    setIsAddDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Asset Management</h1>
        <button
          onClick={() => {
            setSelectedAsset(null);
            setIsAddDialogOpen(true);
          }}
          className="px-4 py-2 bg-foreground text-background border border-border rounded hover:bg-muted transition-colors"
        >
          Add Asset
        </button>
      </div>

      <div className="bg-background rounded-lg shadow border border-border">
        {initialAssets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No assets added yet. Click{' '}
            <button
              onClick={() => {
                setSelectedAsset(null);
                setIsAddDialogOpen(true);
              }}
              className="text-foreground hover:underline border-b border-border"
            >
              Add Asset
            </button>
            {' '}to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Cost Basis</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Acquisition Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className="border-b border-border hover:bg-muted cursor-pointer"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const isInActionsColumn = target.closest('td:last-child');
                      if (!isInActionsColumn && !target.closest('button')) {
                        setSelectedAsset(asset);
                        setIsAddDialogOpen(true);
                      }
                    }}
                  >
                    <td className="px-6 py-4 text-foreground">{asset.name}</td>
                    <td className="px-6 py-4 text-foreground">{formatAssetType(asset.assetType)}</td>
                    <td className="px-6 py-4 text-foreground">{asset.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 text-foreground">{formatCurrency(asset.costBasisPerUnit)}</td>
                    <td className="px-6 py-4 text-foreground">{formatDate(asset.acquisitionDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                            setIsAddDialogOpen(true);
                          }}
                          className="p-2 text-foreground hover:bg-muted border border-border rounded transition-colors"
                          title="Edit asset"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateAsset(asset);
                          }}
                          className="p-2 text-foreground hover:bg-muted border border-border rounded transition-colors"
                          title="Duplicate asset"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-2 text-foreground hover:bg-muted border border-border rounded transition-colors"
                          title="Delete asset"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AssetDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setSelectedAsset(null);
        }}
        onSave={handleSaveAsset}
        asset={selectedAsset}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedAsset(null);
        }}
        onConfirm={handleDeleteAsset}
        assetName={selectedAsset?.name || ''}
      />
    </div>
  );
} 