"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Plus, Pencil, Copy, Trash2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Asset {
  id: string
  name: string
  quantity: number
  costBasisPerUnit: number
  acquisitionDate: Date
  assetType?: string
  fmvPerUnit?: number
}

interface AssetManagementViewProps {
  onBack?: () => void
}

export default function AssetManagementView({ onBack }: AssetManagementViewProps) {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "Vanguard S&P 500 ETF",
      quantity: 100,
      costBasisPerUnit: 350.25,
      acquisitionDate: new Date("2022-03-15"),
      assetType: "Stock",
      fmvPerUnit: 425.8,
    },
    {
      id: "2",
      name: "Apple Inc. (AAPL)",
      quantity: 50,
      costBasisPerUnit: 145.3,
      acquisitionDate: new Date("2023-01-10"),
      assetType: "Stock",
      fmvPerUnit: 185.25,
    },
    {
      id: "3",
      name: "Downtown Condo",
      quantity: 1,
      costBasisPerUnit: 450000,
      acquisitionDate: new Date("2021-06-20"),
      assetType: "Real Estate",
      fmvPerUnit: 520000,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    costBasisPerUnit: "",
    acquisitionDate: undefined as Date | undefined,
    assetType: "",
    fmvPerUnit: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      costBasisPerUnit: "",
      acquisitionDate: undefined,
      assetType: "",
      fmvPerUnit: "",
    })
  }

  const handleAddAsset = () => {
    setEditingAsset(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      name: asset.name,
      quantity: asset.quantity.toString(),
      costBasisPerUnit: asset.costBasisPerUnit.toString(),
      acquisitionDate: asset.acquisitionDate,
      assetType: asset.assetType || "",
      fmvPerUnit: asset.fmvPerUnit?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDuplicateAsset = (asset: Asset) => {
    setEditingAsset(null)
    setFormData({
      name: `${asset.name} (Copy)`,
      quantity: asset.quantity.toString(),
      costBasisPerUnit: asset.costBasisPerUnit.toString(),
      acquisitionDate: asset.acquisitionDate,
      assetType: asset.assetType || "",
      fmvPerUnit: asset.fmvPerUnit?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter((asset) => asset.id !== assetId))
  }

  const handleSaveAsset = (saveAndAddAnother = false) => {
    if (!formData.name || !formData.quantity || !formData.costBasisPerUnit || !formData.acquisitionDate) {
      return
    }

    const assetData: Asset = {
      id: editingAsset?.id || Date.now().toString(),
      name: formData.name,
      quantity: Number.parseFloat(formData.quantity),
      costBasisPerUnit: Number.parseFloat(formData.costBasisPerUnit),
      acquisitionDate: formData.acquisitionDate,
      assetType: formData.assetType || undefined,
      fmvPerUnit: formData.fmvPerUnit ? Number.parseFloat(formData.fmvPerUnit) : undefined,
    }

    if (editingAsset) {
      setAssets(assets.map((asset) => (asset.id === editingAsset.id ? assetData : asset)))
    } else {
      setAssets([...assets, assetData])
    }

    if (saveAndAddAnother) {
      resetForm()
    } else {
      setIsDialogOpen(false)
      resetForm()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotalValue = (asset: Asset) => {
    const value = asset.fmvPerUnit || asset.costBasisPerUnit
    return asset.quantity * value
  }

  const calculateTotalGainLoss = (asset: Asset) => {
    if (!asset.fmvPerUnit) return 0
    return asset.quantity * (asset.fmvPerUnit - asset.costBasisPerUnit)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Assets</h1>
        </div>
        <Button onClick={handleAddAsset} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      {/* Assets Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Assets: </span>
            <span className="font-medium">{assets.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Value: </span>
            <span className="font-medium">
              {formatCurrency(assets.reduce((sum, asset) => sum + calculateTotalValue(asset), 0))}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Gain/Loss: </span>
            <span
              className={cn(
                "font-medium",
                assets.reduce((sum, asset) => sum + calculateTotalGainLoss(asset), 0) >= 0
                  ? "text-green-600"
                  : "text-red-600",
              )}
            >
              {formatCurrency(assets.reduce((sum, asset) => sum + calculateTotalGainLoss(asset), 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Asset List Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Cost Basis/Unit</TableHead>
              <TableHead>Acquisition Date</TableHead>
              <TableHead>Asset Type</TableHead>
              <TableHead className="text-right">FMV/Unit</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="text-right">Gain/Loss</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No assets defined yet. Click "Add New Asset" to get started.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="text-right">{asset.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(asset.costBasisPerUnit)}</TableCell>
                  <TableCell>{format(asset.acquisitionDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{asset.assetType || "-"}</TableCell>
                  <TableCell className="text-right">
                    {asset.fmvPerUnit ? formatCurrency(asset.fmvPerUnit) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(calculateTotalValue(asset))}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      calculateTotalGainLoss(asset) >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {asset.fmvPerUnit ? formatCurrency(calculateTotalGainLoss(asset)) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAsset(asset)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateAsset(asset)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Asset Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            <DialogDescription>Define the details of your financial asset for tax planning analysis.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Asset Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="assetName">Asset Name *</Label>
              <Input
                id="assetName"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Vanguard S&P 500 ETF"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                placeholder="100"
                min="0"
                step="any"
              />
            </div>

            {/* Cost Basis per Unit */}
            <div className="space-y-2">
              <Label htmlFor="costBasis">Cost Basis / Unit *</Label>
              <Input
                id="costBasis"
                type="number"
                value={formData.costBasisPerUnit}
                onChange={(e) => setFormData((prev) => ({ ...prev, costBasisPerUnit: e.target.value }))}
                placeholder="350.25"
                min="0"
                step="0.01"
              />
            </div>

            {/* Acquisition Date */}
            <div className="space-y-2">
              <Label>Acquisition Date *</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.acquisitionDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.acquisitionDate ? format(formData.acquisitionDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.acquisitionDate}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, acquisitionDate: date }))
                      setIsDatePickerOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Asset Type */}
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Input
                id="assetType"
                value={formData.assetType}
                onChange={(e) => setFormData((prev) => ({ ...prev, assetType: e.target.value }))}
                placeholder="e.g., Stock, Real Estate"
              />
            </div>

            {/* Fair Market Value per Unit */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fmvPerUnit">Fair Market Value (FMV) / Unit</Label>
              <Input
                id="fmvPerUnit"
                type="number"
                value={formData.fmvPerUnit}
                onChange={(e) => setFormData((prev) => ({ ...prev, fmvPerUnit: e.target.value }))}
                placeholder="425.80"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {!editingAsset && (
              <Button variant="secondary" onClick={() => handleSaveAsset(true)}>
                Save and Add Another
              </Button>
            )}
            <Button onClick={() => handleSaveAsset(false)}>{editingAsset ? "Save Changes" : "Save Asset"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
