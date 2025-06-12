import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { FormScenario, IncomeSource, AnnualExpense, OneTimeExpense, PlannedAssetSale, Asset } from '@/types';
import type { ScenarioValidationErrors } from '@/types/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncomeSourceDialog } from '@/components/dialogs/IncomeSourceDialog';
import { ExpenseDialog } from '@/components/dialogs/ExpenseDialog';
import { CopyItemsDialog } from '@/components/dialogs/CopyItemsDialog';
import { Section } from '@/components/shared/Section';
import { FormField } from '@/components/shared/FormField';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { dateService } from '@/services/dateService';
import { TableList } from '@/components/shared/TableList';
import { TableListItem } from '@/components/shared/TableListItem';
import { CardList } from '@/components/shared/CardList';
import { INCOME_SOURCE_TYPE_LABELS } from '@/types';
import { PlannedAssetSaleDialog } from '@/components/dialogs/PlannedAssetSaleDialog';
import { QualitativeAttributesContainer } from '@/components/shared/QualitativeAttributesContainer';
import { QuickAddAttributesDialog } from '@/components/dialogs/QuickAddAttributesDialog';
import { useCalculationState } from '@/store/calculationStateSlice';
import { calculateScenarioResults } from '@/services/calculationService';
import { copyItemsToScenario } from '@/services/scenarioService';

interface ValidationErrors {
  [key: string]: string | undefined;
  name?: string;
  country?: string;
  projectionPeriod?: string;
  residencyStartDate?: string;
  shortTermRate?: string;
  longTermRate?: string;
  incomeRate?: string;
}

type ValidationField = keyof ValidationErrors;

interface ValidationRule {
  field: ValidationField;
  validate: (value: any) => string | undefined;
  getValue: (scenario: FormScenario) => any;
}

const validationRules: ValidationRule[] = [
  {
    field: 'name',
    validate: (value: string) => !value ? 'Name is required' : undefined,
    getValue: (scenario: FormScenario) => scenario.name
  },
  {
    field: 'country',
    validate: (value: string) => !value ? 'Country is required' : undefined,
    getValue: (scenario: FormScenario) => scenario.location?.country
  },
  {
    field: 'projectionPeriod',
    validate: (value: number | undefined) => {
      if (value === undefined || value === 0) return 'Projection period must be at least 1 year';
      return value < 1 ? 'Projection period must be at least 1 year' : undefined;
    },
    getValue: (scenario: FormScenario) => scenario.projectionPeriod
  },
  {
    field: 'residencyStartDate',
    validate: (value: Date) => {
      if (!value) return 'Residency start date is required';
      if (!dateService.isValidDate(value)) return 'Invalid date';
      return undefined;
    },
    getValue: (scenario: FormScenario) => scenario.residencyStartDate
  },
  {
    field: 'shortTermRate',
    validate: (value: number | undefined) => {
      if (value === undefined) return undefined;
      return value < 0 || value > 100 ? 'Must be between 0% and 100%' : undefined;
    },
    getValue: (scenario: FormScenario) => scenario.tax?.capitalGains?.shortTermRate
  },
  {
    field: 'longTermRate',
    validate: (value: number | undefined) => {
      if (value === undefined) return undefined;
      return value < 0 || value > 100 ? 'Must be between 0% and 100%' : undefined;
    },
    getValue: (scenario: FormScenario) => scenario.tax?.capitalGains?.longTermRate
  },
  {
    field: 'incomeRate',
    validate: (value: number | undefined) => {
      if (value === undefined) return undefined;
      return value < 0 || value > 100 ? 'Must be between 0% and 100%' : undefined;
    },
    getValue: (scenario: FormScenario) => scenario.tax?.incomeRate
  }
];

export function ScenarioEditorView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateScenario, scenarios, initialAssets, userQualitativeGoals, addIncomeSource, updateIncomeSource, removeIncomeSource, addExpense, updateExpense, removeExpense, addPlannedAssetSale, updatePlannedAssetSale, removePlannedAssetSale, addMultipleScenarioAttributes } = useUserAppState();
  const { setScenarioResults } = useCalculationState();
  
  // Get the current scenario from the store
  const scenario = scenarios.find(s => s.id === id);
  
  // If scenario not found, redirect to scenarios list
  useEffect(() => {
    if (!scenario) {
      navigate('/scenarios');
    }
  }, [scenario, navigate]);

  // Form state for basic fields
  const [formData, setFormData] = useState({
    name: scenario?.name || '',
    country: scenario?.location?.country || '',
    state: scenario?.location?.state || '',
    city: scenario?.location?.city || '',
    projectionPeriod: (scenario?.projectionPeriod ?? 1) as number,
    residencyStartDate: scenario?.residencyStartDate ? new Date(scenario.residencyStartDate) : new Date(),
    shortTermRate: scenario?.tax?.capitalGains?.shortTermRate || 0,
    longTermRate: scenario?.tax?.capitalGains?.longTermRate || 0,
    incomeRate: scenario?.tax?.incomeRate || 0,
  });

  // Update form data when scenario changes
  useEffect(() => {
    if (scenario) {
      setFormData({
        name: scenario.name,
        country: scenario.location?.country || '',
        state: scenario.location?.state || '',
        city: scenario.location?.city || '',
        projectionPeriod: (scenario.projectionPeriod ?? 1) as number,
        residencyStartDate: new Date(scenario.residencyStartDate),
        shortTermRate: scenario.tax?.capitalGains?.shortTermRate || 0,
        longTermRate: scenario.tax?.capitalGains?.longTermRate || 0,
        incomeRate: scenario.tax?.incomeRate || 0,
      });
    }
  }, [scenario]);

  const [errors, setErrors] = useState<ScenarioValidationErrors>({});
  const [isIncomeSourceDialogOpen, setIsIncomeSourceDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isPlannedAssetSaleDialogOpen, setIsPlannedAssetSaleDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [editingIncomeSource, setEditingIncomeSource] = useState<IncomeSource | Omit<IncomeSource, 'id'> | undefined>();
  const [editingExpense, setEditingExpense] = useState<AnnualExpense | OneTimeExpense | Omit<AnnualExpense, 'id'> | Omit<OneTimeExpense, 'id'> | undefined>();
  const [editingPlannedAssetSale, setEditingPlannedAssetSale] = useState<PlannedAssetSale | Omit<PlannedAssetSale, 'id'> | undefined>();
  const [expenseType, setExpenseType] = useState<'annual' | 'oneTime'>('annual');
  const [incomeSourceView, setIncomeSourceView] = useState<'card' | 'table'>('card');
  const [annualExpenseView, setAnnualExpenseView] = useState<'card' | 'table'>('card');
  const [oneTimeExpenseView, setOneTimeExpenseView] = useState<'card' | 'table'>('card');
  const [plannedAssetSaleView, setPlannedAssetSaleView] = useState<'card' | 'table'>('card');
  const [copyDialogType, setCopyDialogType] = useState<'incomeSource' | 'annualExpense' | 'oneTimeExpense' | 'plannedAssetSale'>('incomeSource');
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  
  const validateField = (field: ValidationField, value: any): string | undefined => {
    const validationRule = validationRules.find(r => r.field === field);
    if (!validationRule) return undefined;
    return validationRule.validate(value);
  };

  const handleFieldChange = (field: ValidationField, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: ValidationField, value: any) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    if (!id) return;
    
    const updatedScenario = {
      ...scenario!,
      name: formData.name,
      location: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
      },
      projectionPeriod: formData.projectionPeriod,
      residencyStartDate: formData.residencyStartDate,
      tax: {
        capitalGains: {
          shortTermRate: formData.shortTermRate,
          longTermRate: formData.longTermRate,
        },
        incomeRate: formData.incomeRate,
      },
    };
    updateScenario(id, updatedScenario);
  };

  const handleIncomeSourceSave = (incomeSource: Omit<IncomeSource, 'id'>) => {
    if (!id) return;
    
    if (editingIncomeSource && 'id' in editingIncomeSource) {
      updateIncomeSource(id, editingIncomeSource.id, incomeSource);
    } else {
      addIncomeSource(id, incomeSource);
    }
    setIsIncomeSourceDialogOpen(false);
  };

  const handleIncomeSourceDelete = (incomeSourceId: string) => {
    if (!id) return;
    removeIncomeSource(id, incomeSourceId);
  };

  const handleExpenseSave = (expense: Omit<AnnualExpense, 'id'> | Omit<OneTimeExpense, 'id'>, type: 'annual' | 'oneTime') => {
    if (!id) return;
    
    if (editingExpense && 'id' in editingExpense) {
      const updatedExpense = { ...expense, id: editingExpense.id };
      updateExpense(id, editingExpense.id, updatedExpense, type);
    } else {
      addExpense(id, expense, type);
    }
    setEditingExpense(undefined);
    setIsExpenseDialogOpen(false);
  };

  const handleExpenseDelete = (expenseId: string, type: 'annual' | 'oneTime') => {
    if (!id) return;
    removeExpense(id, expenseId, type);
  };

  const handleEditIncomeSource = (incomeSource: IncomeSource) => {
    setEditingIncomeSource(incomeSource);
    setIsIncomeSourceDialogOpen(true);
  };

  const handleEditExpense = (expense: AnnualExpense | OneTimeExpense) => {
    setEditingExpense(expense);
    setExpenseType('year' in expense ? 'oneTime' : 'annual');
    setIsExpenseDialogOpen(true);
  };

  const handleAddExpense = (type: 'annual' | 'oneTime') => {
    setEditingExpense(undefined);
    setExpenseType(type);
    setIsExpenseDialogOpen(true);
  };

  const duplicateIncomeSource = (incomeSource: IncomeSource) => {
    const { id, ...incomeSourceWithoutId } = incomeSource;
    setEditingIncomeSource(incomeSourceWithoutId);
    setIsIncomeSourceDialogOpen(true);
  };

  const duplicateExpense = (expense: AnnualExpense | OneTimeExpense) => {
    const { id, ...expenseWithoutId } = expense;
    setEditingExpense(expenseWithoutId);
    setIsExpenseDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleIncomeSourceDialogClose = () => {
    setIsIncomeSourceDialogOpen(false);
    setEditingIncomeSource(undefined);
  };

  const handleExpenseDialogClose = () => {
    setIsExpenseDialogOpen(false);
    setEditingExpense(undefined);
  };

  const handleCopyItemsSave = (items: any[]) => {
    if (!id || !scenario) return;
    
    const updatedScenario = copyItemsToScenario(scenario, items, copyDialogType);
    updateScenario(id, updatedScenario);
    setIsCopyDialogOpen(false);
  };

  const handleCopyDialogClose = () => {
    setIsCopyDialogOpen(false);
  };

  const handlePlannedAssetSaleSave = (sale: Omit<PlannedAssetSale, 'id'>) => {
    if (!id) return;
    
    if (editingPlannedAssetSale && 'id' in editingPlannedAssetSale) {
      // For updates, we need to preserve the existing ID
      const updatedSale = { ...sale, id: editingPlannedAssetSale.id };
      updatePlannedAssetSale(id, editingPlannedAssetSale.id, updatedSale);
    } else {
      addPlannedAssetSale(id, sale);
    }
    setEditingPlannedAssetSale(undefined);
    setIsPlannedAssetSaleDialogOpen(false);
  };

  const handlePlannedAssetSaleDelete = (saleId: string) => {
    if (!id) return;
    removePlannedAssetSale(id, saleId);
  };

  const handleEditPlannedAssetSale = (sale: PlannedAssetSale) => {
    setEditingPlannedAssetSale(sale);
    setIsPlannedAssetSaleDialogOpen(true);
  };

  const handleAddPlannedAssetSale = () => {
    setEditingPlannedAssetSale(undefined);
    setIsPlannedAssetSaleDialogOpen(true);
  };

  const duplicatePlannedAssetSale = (sale: PlannedAssetSale) => {
    const { id, ...saleWithoutId } = sale;
    setEditingPlannedAssetSale(saleWithoutId);
    setIsPlannedAssetSaleDialogOpen(true);
  };

  const handleQuickAddAttributes = (attributes: { goalId: string; description: string }[]) => {
    if (!id) return;

    const newAttributes = attributes.map(attr => ({
      name: attr.description,
      goalId: attr.goalId,
      significance: "Low" as const,
      sentiment: "Neutral" as const,
      mappedGoalId: attr.goalId
    }));

    addMultipleScenarioAttributes(id, newAttributes);

    // Recalculate and update scenario results
    const updatedScenario = scenarios.find(s => s.id === id);
    if (updatedScenario) {
      const results = calculateScenarioResults(updatedScenario, initialAssets, userQualitativeGoals);
      setScenarioResults(id, results);
    }
  };

  const handlePlannedAssetSaleDialogClose = () => {
    setIsPlannedAssetSaleDialogOpen(false);
    setEditingPlannedAssetSale(undefined);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{scenario?.name || 'Edit Scenario'}</h1>
          <p className="text-muted-foreground mt-2">
            Configure your scenario details and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/scenarios/${id}/view`)}
            disabled={!scenario}
          >
            View Scenario
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/overview')}
          >
            Back to Scenarios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="qualitative">Impressions</TabsTrigger>
          <TabsTrigger value="assets">Asset Sales</TabsTrigger>
          <TabsTrigger value="annual">Annual Expenses</TabsTrigger>
          <TabsTrigger value="oneTime">One-Time Expenses</TabsTrigger>
          <TabsTrigger value="income">Income Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Section title="Basic Information">
            <div className="grid gap-4">
              <FormField
                id="name"
                label="Scenario Name"
                error={errors.name}
              >
                <Input
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  placeholder="Enter scenario name"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  id="country"
                  label="Country"
                  error={errors.country}
                >
                  <Input
                    value={formData.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    onBlur={(e) => handleFieldBlur('country', e.target.value)}
                    placeholder="Enter country"
                  />
                </FormField>

                <FormField
                  id="state"
                  label="State/Province"
                >
                  <Input
                    value={formData.state}
                    onChange={(e) => {
                      handleFieldChange('state', e.target.value);
                    }}
                    placeholder="Enter state/province (optional)"
                  />
                </FormField>

                <FormField
                  id="city"
                  label="City"
                >
                  <Input
                    value={formData.city}
                    onChange={(e) => {
                      handleFieldChange('city', e.target.value);
                    }}
                    placeholder="Enter city (optional)"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="projectionPeriod"
                  label="Projection Period (Years)"
                  error={errors.projectionPeriod}
                >
                  <Input
                    type="number"
                    value={formData.projectionPeriod}
                    onChange={(e) => handleFieldChange('projectionPeriod', parseInt(e.target.value))}
                    onBlur={(e) => handleFieldBlur('projectionPeriod', parseInt(e.target.value))}
                    placeholder="Enter projection period"
                  />
                </FormField>

                <FormField
                  id="residencyStartDate"
                  label="Residency Start Date"
                  error={errors.residencyStartDate}
                >
                  <Input
                    type="date"
                    value={formData.residencyStartDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      handleFieldChange('residencyStartDate', date);
                    }}
                    onBlur={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      handleFieldBlur('residencyStartDate', date);
                    }}
                  />
                </FormField>
              </div>
            </div>
          </Section>

          <Section title="Capital Gains and Income Tax Rates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                id="shortTermRate"
                label="Short-Term CGT Rate (%)"
                error={errors.shortTermRate}
              >
                <Input
                  type="number"
                  value={formData.shortTermRate}
                  onChange={(e) => handleFieldChange('shortTermRate', parseFloat(e.target.value))}
                  onBlur={(e) => handleFieldBlur('shortTermRate', parseFloat(e.target.value))}
                  placeholder="Enter short-term rate"
                />
              </FormField>

              <FormField
                id="longTermRate"
                label="Long-Term CGT Rate (%)"
                error={errors.longTermRate}
              >
                <Input
                  type="number"
                  value={formData.longTermRate}
                  onChange={(e) => handleFieldChange('longTermRate', parseFloat(e.target.value))}
                  onBlur={(e) => handleFieldBlur('longTermRate', parseFloat(e.target.value))}
                  placeholder="Enter long-term rate"
                />
              </FormField>

              <FormField
                id="incomeRate"
                label="Income Tax Rate (%)"
                error={errors.incomeRate}
              >
                <Input
                  type="number"
                  value={formData.incomeRate}
                  onChange={(e) => handleFieldChange('incomeRate', parseFloat(e.target.value))}
                  onBlur={(e) => handleFieldBlur('incomeRate', parseFloat(e.target.value))}
                  placeholder="Enter income tax rate"
                />
              </FormField>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="qualitative">
          <QualitativeAttributesContainer
            scenarioId={scenario?.id || ''}
            disabled={false}
            onQuickAdd={() => setIsQuickAddDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="assets">
          <Section
            title="Planned Asset Sales"
            view={plannedAssetSaleView}
            onViewChange={setPlannedAssetSaleView}
            onCopy={() => {
              setCopyDialogType('plannedAssetSale');
              setIsCopyDialogOpen(true);
            }}
            onAdd={handleAddPlannedAssetSale}
            hasItems={(scenario?.plannedAssetSales?.length ?? 0) > 0}
            emptyMessage="No planned asset sales added yet. Add your first planned sale to get started."
          >
            {plannedAssetSaleView === 'card' ? (
              <CardList>
                {(scenario?.plannedAssetSales || []).map((sale) => {
                  const asset = initialAssets.find((a: Asset) => a.id === sale.assetId);
                  return (
                    <ListItemCard
                      key={sale.id}
                      title={asset?.name || 'Unknown Asset'}
                      lines={[
                        `Sell ${sale.quantity} in ${sale.year}`,
                        `Each: $${sale.salePricePerUnit.toFixed(2)}`,
                        `Total: $${(sale.quantity * sale.salePricePerUnit).toFixed(2)}`
                      ]}
                      onEdit={() => handleEditPlannedAssetSale(sale)}
                      onDelete={() => handlePlannedAssetSaleDelete(sale.id)}
                      onDuplicate={() => duplicatePlannedAssetSale(sale)}
                    />
                  );
                })}
              </CardList>
            ) : (
              <TableList
                columns={[
                  { key: 'asset', label: 'Asset' },
                  { key: 'year', label: 'Year' },
                  { key: 'quantity', label: 'Quantity' },
                  { key: 'price', label: 'Sale Price/Unit' },
                  { key: 'total', label: 'Total' }
                ]}
              >
                {(scenario?.plannedAssetSales || []).map((sale) => {
                  const asset = initialAssets.find((a: Asset) => a.id === sale.assetId);
                  return (
                    <TableListItem
                      key={sale.id}
                      data={{
                        asset: asset?.name || 'Unknown Asset',
                        year: sale.year.toString(),
                        quantity: sale.quantity.toString(),
                        price: `$${sale.salePricePerUnit.toFixed(2)}`,
                        total: `$${(sale.quantity * sale.salePricePerUnit).toFixed(2)}`
                      }}
                      columns={[
                        { key: 'asset', label: 'Asset' },
                        { key: 'year', label: 'Year' },
                        { key: 'quantity', label: 'Quantity' },
                        { key: 'price', label: 'Sale Price/Unit' },
                        { key: 'total', label: 'Total' }
                      ]}
                      onEdit={() => handleEditPlannedAssetSale(sale)}
                      onDelete={() => handlePlannedAssetSaleDelete(sale.id)}
                      onDuplicate={() => duplicatePlannedAssetSale(sale)}
                    />
                  );
                })}
              </TableList>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="annual">
          <Section
            title="Annual Expenses"
            view={annualExpenseView}
            onViewChange={setAnnualExpenseView}
            onCopy={() => {
              setCopyDialogType('annualExpense');
              setIsCopyDialogOpen(true);
            }}
            onAdd={() => handleAddExpense('annual')}
            error={errors.annualExpenses}
            hasItems={(scenario?.annualExpenses?.length ?? 0) > 0}
            emptyMessage="No annual expenses added yet. Add your first annual expense to get started."
          >
            {annualExpenseView === 'card' ? (
              <CardList>
                {scenario?.annualExpenses?.map((expense) => (
                  <ListItemCard
                    key={expense.id}
                    title={expense.name}
                    lines={[
                      formatCurrency(expense.amount) + '/year'
                    ]}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => handleExpenseDelete(expense.id, 'annual')}
                    onDuplicate={() => duplicateExpense(expense)}
                  />
                ))}
              </CardList>
            ) : (
              <TableList
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'amount', label: 'Amount' },
                ]}
              >
                {scenario?.annualExpenses?.map((expense) => (
                  <TableListItem
                    key={expense.id}
                    data={{
                      name: expense.name,
                      amount: formatCurrency(expense.amount) + '/year',
                    }}
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'amount', label: 'Amount' },
                    ]}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => handleExpenseDelete(expense.id, 'annual')}
                    onDuplicate={() => duplicateExpense(expense)}
                  />
                ))}
              </TableList>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="oneTime">
          <Section
            title="One-Time Expenses"
            view={oneTimeExpenseView}
            onViewChange={setOneTimeExpenseView}
            onCopy={() => {
              setCopyDialogType('oneTimeExpense');
              setIsCopyDialogOpen(true);
            }}
            onAdd={() => handleAddExpense('oneTime')}
            error={errors.oneTimeExpenses}
            hasItems={(scenario?.oneTimeExpenses?.length ?? 0) > 0}
            emptyMessage="No one-time expenses added yet. Add your first one-time expense to get started."
          >
            {oneTimeExpenseView === 'card' ? (
              <CardList>
                {scenario?.oneTimeExpenses?.map((expense) => (
                  <ListItemCard
                    key={expense.id}
                    title={expense.name}
                    lines={[
                      `${formatCurrency(expense.amount)} in ${expense.year}`
                    ]}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => handleExpenseDelete(expense.id, 'oneTime')}
                    onDuplicate={() => duplicateExpense(expense)}
                  />
                ))}
              </CardList>
            ) : (
              <TableList
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'year', label: 'Year' },
                ]}
              >
                {scenario?.oneTimeExpenses?.map((expense) => (
                  <TableListItem
                    key={expense.id}
                    data={{
                      name: expense.name,
                      amount: formatCurrency(expense.amount),
                      year: expense.year,
                    }}
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'amount', label: 'Amount' },
                      { key: 'year', label: 'Year' },
                    ]}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => handleExpenseDelete(expense.id, 'oneTime')}
                    onDuplicate={() => duplicateExpense(expense)}
                  />
                ))}
              </TableList>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="income">
          <Section
            title="Income Sources"
            view={incomeSourceView}
            onViewChange={setIncomeSourceView}
            onCopy={() => {
              setCopyDialogType('incomeSource');
              setIsCopyDialogOpen(true);
            }}
            onAdd={() => {
              setEditingIncomeSource(undefined);
              setIsIncomeSourceDialogOpen(true);
            }}
            error={errors.incomeSources}
            hasItems={(scenario?.incomeSources?.length ?? 0) > 0}
            emptyMessage="No income sources added yet. Add your first income source to get started."
          >
            {incomeSourceView === 'card' ? (
              <CardList>
                {scenario?.incomeSources?.map((source) => (
                  <ListItemCard
                    key={source.id}
                    title={source.name}
                    lines={[
                      formatCurrency(source.annualAmount) + '/year',
                      `${source.startYear} - ${source.endYear || 'Ongoing'}`
                    ]}
                    onEdit={() => handleEditIncomeSource(source)}
                    onDelete={() => handleIncomeSourceDelete(source.id)}
                    onDuplicate={() => duplicateIncomeSource(source)}
                  />
                ))}
              </CardList>
            ) : (
              <TableList
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'type', label: 'Type' },
                  { key: 'annualAmount', label: 'Annual Amount' },
                  { key: 'startYear', label: 'Start Year' },
                  { key: 'endYear', label: 'End Year' },
                ]}
              >
                {scenario?.incomeSources?.map((source) => (
                  <TableListItem
                    key={source.id}
                    data={{
                      name: source.name,
                      type: INCOME_SOURCE_TYPE_LABELS[source.type],
                      annualAmount: formatCurrency(source.annualAmount),
                      startYear: source.startYear,
                      endYear: source.endYear || 'Ongoing',
                    }}
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'type', label: 'Type' },
                      { key: 'annualAmount', label: 'Annual Amount' },
                      { key: 'startYear', label: 'Start Year' },
                      { key: 'endYear', label: 'End Year' },
                    ]}
                    onEdit={() => handleEditIncomeSource(source)}
                    onDelete={() => handleIncomeSourceDelete(source.id)}
                    onDuplicate={() => duplicateIncomeSource(source)}
                  />
                ))}
              </TableList>
            )}
          </Section>
        </TabsContent>
      </Tabs>

      <IncomeSourceDialog
        open={isIncomeSourceDialogOpen}
        onOpenChange={handleIncomeSourceDialogClose}
        incomeSource={editingIncomeSource}
        mode={!editingIncomeSource ? 'add' : ('id' in editingIncomeSource && scenario?.incomeSources?.some(s => s.id === editingIncomeSource.id)) ? 'edit' : 'duplicate'}
        onSave={handleIncomeSourceSave}
      />

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={handleExpenseDialogClose}
        onSave={(expense) => handleExpenseSave(expense, expenseType)}
        expense={editingExpense}
        mode={!editingExpense ? 'add' : ('id' in editingExpense && (scenario?.annualExpenses?.some(e => e.id === editingExpense.id) || scenario?.oneTimeExpenses?.some(e => e.id === editingExpense.id))) ? 'edit' : 'duplicate'}
        type={expenseType}
      />

      <PlannedAssetSaleDialog
        open={isPlannedAssetSaleDialogOpen}
        onOpenChange={handlePlannedAssetSaleDialogClose}
        onSave={handlePlannedAssetSaleSave}
        sale={editingPlannedAssetSale}
        mode={!editingPlannedAssetSale ? 'add' : ('id' in editingPlannedAssetSale && scenario?.plannedAssetSales?.some(s => s.id === editingPlannedAssetSale.id)) ? 'edit' : 'duplicate'}
        assets={initialAssets}
        projectionPeriod={scenario?.projectionPeriod ?? 0}
      />

      <CopyItemsDialog
        open={isCopyDialogOpen}
        onOpenChange={handleCopyDialogClose}
        onSave={handleCopyItemsSave}
        scenarios={scenarios}
        currentScenarioId={scenario?.id || ''}
        type={copyDialogType}
        assets={initialAssets}
      />

      <QuickAddAttributesDialog
        open={isQuickAddDialogOpen}
        onOpenChange={setIsQuickAddDialogOpen}
        onSave={handleQuickAddAttributes}
        goals={userQualitativeGoals}
      />
    </div>
  );
} 