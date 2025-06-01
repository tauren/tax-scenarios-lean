import { useState } from 'react';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { Asset } from '@/types';
import { AssetDialog } from '@/components/dialogs/AssetDialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/DeleteConfirmationDialog';
import { v4 as uuidv4 } from 'uuid';
import { formatAssetType } from '@/utils/formatting';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Copy, Trash2, Plus } from 'lucide-react';
import { Section } from "@/components/shared/section";

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
      <Section
        title="Asset Management"
        action={
          <Button
            onClick={() => {
              setSelectedAsset(null);
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        }
      >
        {initialAssets.length === 0 ? (
          <div className="mt-8 p-12 text-center border rounded-lg bg-muted/5">
            <p className="text-muted-foreground mb-4">
              No assets added yet. Click the button below to get started.
            </p>
            <Button
              onClick={() => {
                setSelectedAsset(null);
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost Basis</TableHead>
                  <TableHead>Acquisition Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialAssets.map((asset) => (
                  <TableRow 
                    key={asset.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const isInActionsColumn = target.closest('td:last-child');
                      if (!isInActionsColumn && !target.closest('button')) {
                        setSelectedAsset(asset);
                        setIsAddDialogOpen(true);
                      }
                    }}
                  >
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{formatAssetType(asset.assetType)}</TableCell>
                    <TableCell>{asset.quantity.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(asset.costBasisPerUnit)}</TableCell>
                    <TableCell>{formatDate(asset.acquisitionDate)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAsset(asset);
                                  setIsAddDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit asset</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateAsset(asset);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate asset</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAsset(asset);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete asset</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Section>

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