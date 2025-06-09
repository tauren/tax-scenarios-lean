import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { Scenario, FormScenario, IncomeSource, AnnualExpense, OneTimeExpense, PlannedAssetSale, Asset } from '@/types';
import type { ScenarioValidationErrors } from '@/types/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { v4 as uuidv4 } from 'uuid';
import { IncomeSourceDialog } from '@/components/dialogs/IncomeSourceDialog';
import { ExpenseDialog } from '@/components/dialogs/ExpenseDialog';
import { CopyItemsDialog } from '@/components/dialogs/CopyItemsDialog';
import { Section } from '@/components/shared/Section';
import { FormField } from '@/components/shared/FormField';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { deepClone } from '@/utils/clone';
import { dateService } from '@/services/dateService';
import { TableList } from '@/components/shared/TableList';
import { TableListItem } from '@/components/shared/TableListItem';
import { CardList } from '@/components/shared/CardList';
import { INCOME_SOURCE_TYPE_LABELS } from '@/types';
import { PlannedAssetSaleDialog } from '@/components/dialogs/PlannedAssetSaleDialog';
import { convertFormScenarioToScenario } from '@/types';
import { QualitativeAttributesContainer } from '@/components/shared/QualitativeAttributesContainer';

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
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addScenario, updateScenario, scenarios, initialAssets, userQualitativeGoals } = useUserAppState();
  const [scenario, setScenario] = useState<FormScenario>(() => {
    if (id && id !== 'new') {
      const existingScenario = scenarios.find(s => s.id === id);
      if (existingScenario) {
        return {
          ...existingScenario,
          tax: {
            capitalGains: {
              shortTermRate: existingScenario.tax?.capitalGains?.shortTermRate,
              longTermRate: existingScenario.tax?.capitalGains?.longTermRate
            },
            incomeRate: existingScenario.tax?.incomeRate
          },
          scenarioSpecificAttributes: existingScenario.scenarioSpecificAttributes || []
        };
      }
    }
    return {
      id: '',
      name: '',
      projectionPeriod: undefined,
      residencyStartDate: new Date(),
      location: {
        country: '',
        state: '',
        city: ''
      },
      tax: {
        capitalGains: {
          shortTermRate: undefined,
          longTermRate: undefined
        },
        incomeRate: undefined
      },
      incomeSources: [],
      annualExpenses: [],
      oneTimeExpenses: [],
      plannedAssetSales: [],
      scenarioSpecificAttributes: []
    };
  });
  const [errors, setErrors] = useState<ScenarioValidationErrors>({});
  const [isIncomeSourceDialogOpen, setIsIncomeSourceDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isPlannedAssetSaleDialogOpen, setIsPlannedAssetSaleDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [editingIncomeSource, setEditingIncomeSource] = useState<IncomeSource | undefined>();
  const [editingExpense, setEditingExpense] = useState<AnnualExpense | OneTimeExpense | undefined>();
  const [editingPlannedAssetSale, setEditingPlannedAssetSale] = useState<PlannedAssetSale | undefined>();
  const [expenseType, setExpenseType] = useState<'annual' | 'oneTime'>('annual');
  const [incomeSourceView, setIncomeSourceView] = useState<'card' | 'table'>('card');
  const [annualExpenseView, setAnnualExpenseView] = useState<'card' | 'table'>('card');
  const [oneTimeExpenseView, setOneTimeExpenseView] = useState<'card' | 'table'>('card');
  const [plannedAssetSaleView, setPlannedAssetSaleView] = useState<'card' | 'table'>('card');
  const [copyDialogType, setCopyDialogType] = useState<'incomeSource' | 'annualExpense' | 'oneTimeExpense' | 'plannedAssetSale'>('incomeSource');
  
  const isCreating = id === 'new';

  useEffect(() => {
    // Check if we're creating a new scenario by checking the pathname
    const isNewScenario = location.pathname === '/scenarios/new';

    // If we have an ID in the URL, find the scenario
    if (id && !isNewScenario) {
      const existingScenario = scenarios.find(s => s.id === id);
      if (existingScenario) {
        setScenario(deepClone(existingScenario) as FormScenario);
      } else {
        // If scenario not found, redirect to scenarios list
        navigate('/scenarios');
      }
    } else if (isNewScenario) {
      // If we have a template from the previous view, use it
      const state = location.state as { template?: Scenario };
      if (state?.template) {
        // Deep copy the template scenario
        const templateCopy = deepClone(state.template);
        
        // Create a new scenario from the template
        const newScenario: FormScenario = {
          ...templateCopy,
          id: uuidv4(), // Ensure new ID for new scenario
          name: templateCopy.name || templateCopy.location.country,
          projectionPeriod: templateCopy.projectionPeriod,
          residencyStartDate: dateService.isValidDate(templateCopy.residencyStartDate) 
            ? templateCopy.residencyStartDate 
            : new Date(),
          location: {
            country: templateCopy.location?.country || '',
            state: templateCopy.location?.state || '',
            city: templateCopy.location?.city || '',
          },
          tax: {
            capitalGains: {
              shortTermRate: templateCopy.tax?.capitalGains?.shortTermRate,
              longTermRate: templateCopy.tax?.capitalGains?.longTermRate,
            },
            incomeRate: templateCopy.tax?.incomeRate
          },
          incomeSources: templateCopy.incomeSources ?? [],
          annualExpenses: templateCopy.annualExpenses ?? [],
          oneTimeExpenses: templateCopy.oneTimeExpenses ?? [],
          plannedAssetSales: templateCopy.plannedAssetSales ?? [],
          scenarioSpecificAttributes: templateCopy.scenarioSpecificAttributes || []
        };
        setScenario(newScenario);
      }
    }
  }, [id, location.state, location.pathname, scenarios, navigate]);

  const validateField = (field: ValidationField, value: any): string | undefined => {
    const validationRule = validationRules.find(r => r.field === field);
    if (!validationRule) return undefined;
    return validationRule.validate(value);
  };

  const handleFieldChange = (field: ValidationField, value: any) => {
    // Always update the form value to allow free editing
    const updatedScenario = { ...scenario };
    switch (field) {
      case 'name':
        updatedScenario.name = value;
        break;
      case 'country':
        updatedScenario.location = { ...updatedScenario.location, country: value };
        break;
      case 'projectionPeriod':
        updatedScenario.projectionPeriod = value;
        break;
      case 'residencyStartDate':
        updatedScenario.residencyStartDate = value;
        break;
      case 'shortTermRate':
        updatedScenario.tax = { 
          capitalGains: { 
            shortTermRate: value === '' ? undefined : Number(value),
            longTermRate: updatedScenario.tax?.capitalGains?.longTermRate
          },
          incomeRate: updatedScenario.tax?.incomeRate
        };
        break;
      case 'longTermRate':
        updatedScenario.tax = { 
          capitalGains: { 
            shortTermRate: updatedScenario.tax?.capitalGains?.shortTermRate,
            longTermRate: value === '' ? undefined : Number(value)
          },
          incomeRate: updatedScenario.tax?.incomeRate
        };
        break;
      case 'incomeRate':
        updatedScenario.tax = { 
          capitalGains: { 
            shortTermRate: updatedScenario.tax?.capitalGains?.shortTermRate,
            longTermRate: updatedScenario.tax?.capitalGains?.longTermRate
          },
          incomeRate: value === '' ? undefined : Number(value)
        };
        break;
    }
    setScenario(updatedScenario);
  };

  const handleFieldBlur = (field: ValidationField, value: any) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    // For required fields, only update store if the new value is valid and not empty
    const requiredFields = ['name', 'country', 'projectionPeriod', 'residencyStartDate'] as const;
    const isRequiredField = requiredFields.includes(field as typeof requiredFields[number]);
    
    if (id && id !== 'new') {
      if (!isRequiredField || (value !== undefined && value !== '' && value !== null)) {
        // For non-required fields or valid required fields, update the store
        const scenarioToUpdate = convertFormScenarioToScenario(scenario);
        updateScenario(id, scenarioToUpdate);
      } else {
        // For invalid required fields, revert to the last valid value from the store
        const currentScenario = scenarios.find(s => s.id === id);
        if (currentScenario) {
          const revertedScenario = { ...scenario };
          switch (field) {
            case 'name':
              revertedScenario.name = currentScenario.name;
              break;
            case 'country':
              revertedScenario.location = { 
                ...revertedScenario.location, 
                country: currentScenario.location.country 
              };
              break;
            case 'projectionPeriod':
              revertedScenario.projectionPeriod = currentScenario.projectionPeriod;
              break;
            case 'residencyStartDate':
              revertedScenario.residencyStartDate = currentScenario.residencyStartDate;
              break;
          }
          setScenario(revertedScenario);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate each field using the validation rules
    validationRules.forEach(validationRule => {
      const value = validationRule.getValue(scenario);
      const error = validationRule.validate(value);
      if (error) {
        newErrors[validationRule.field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    validateForm();
  }, [scenario]);

  const handleIncomeSourceSave = (incomeSource: IncomeSource) => {
    // Check if this is an existing item in our list
    const existingItem = scenario.incomeSources?.find(source => source.id === incomeSource.id);
    
    if (existingItem) {
      // Update existing item
      setScenario({
        ...scenario,
        incomeSources: scenario.incomeSources?.map((source) =>
          source.id === incomeSource.id ? incomeSource : source
        ),
      });
    } else {
      // Add new item (either from duplicate or new)
      setScenario({
        ...scenario,
        incomeSources: [...(scenario.incomeSources || []), incomeSource],
      });
    }
  };

  const handleExpenseSave = (expense: AnnualExpense | OneTimeExpense) => {
    if (expenseType === 'annual') {
      // Check if this is an existing annual expense
      const existingItem = scenario.annualExpenses?.find(exp => exp.id === expense.id);
      
      if (existingItem) {
        // Update existing annual expense
        setScenario({
          ...scenario,
          annualExpenses: scenario.annualExpenses?.map((exp) =>
            exp.id === expense.id ? expense as AnnualExpense : exp
          ),
        });
      } else {
        // Add new annual expense
        setScenario({
          ...scenario,
          annualExpenses: [...(scenario.annualExpenses || []), expense as AnnualExpense],
        });
      }
    } else {
      // Check if this is an existing one-time expense
      const existingItem = scenario.oneTimeExpenses?.find(exp => exp.id === expense.id);
      
      if (existingItem) {
        // Update existing one-time expense
        setScenario({
          ...scenario,
          oneTimeExpenses: scenario.oneTimeExpenses?.map((exp) =>
            exp.id === expense.id ? expense as OneTimeExpense : exp
          ),
        });
      } else {
        // Add new one-time expense
        setScenario({
          ...scenario,
          oneTimeExpenses: [...(scenario.oneTimeExpenses || []), expense as OneTimeExpense],
        });
      }
    }
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
    const duplicatedSource = { ...incomeSource, id: uuidv4() };
    setEditingIncomeSource(duplicatedSource);
    setIsIncomeSourceDialogOpen(true);
  };

  const duplicateExpense = (expense: AnnualExpense | OneTimeExpense) => {
    const duplicatedExpense = { ...expense, id: uuidv4() };
    setEditingExpense(duplicatedExpense);
    setIsExpenseDialogOpen(true);
  };

  const removeIncomeSource = (id: string) => {
    setScenario({
      ...scenario,
      incomeSources: scenario.incomeSources?.filter((source) => source.id !== id),
    });
  };

  const removeExpense = (id: string, type: 'annual' | 'oneTime') => {
    if (type === 'annual') {
      setScenario({
        ...scenario,
        annualExpenses: scenario.annualExpenses?.filter((exp) => exp.id !== id) || [],
      });
    } else {
      setScenario({
        ...scenario,
        oneTimeExpenses: scenario.oneTimeExpenses?.filter((exp) => exp.id !== id) || [],
      });
    }
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
    const updatedScenario = deepClone(scenario);
    
    switch (copyDialogType) {
      case 'incomeSource':
        updatedScenario.incomeSources = [...(updatedScenario.incomeSources || []), ...items];
        break;
      case 'annualExpense':
        updatedScenario.annualExpenses = [...(updatedScenario.annualExpenses || []), ...items];
        break;
      case 'oneTimeExpense':
        updatedScenario.oneTimeExpenses = [...(updatedScenario.oneTimeExpenses || []), ...items];
        break;
      case 'plannedAssetSale':
        updatedScenario.plannedAssetSales = [...(updatedScenario.plannedAssetSales || []), ...items];
        break;
    }
    
    setScenario(updatedScenario);
    setIsCopyDialogOpen(false);
  };

  const handleCopyDialogClose = () => {
    setIsCopyDialogOpen(false);
  };

  const handlePlannedAssetSaleSave = (sale: PlannedAssetSale) => {
    const updatedScenario = deepClone(scenario);
    
    if (editingPlannedAssetSale && scenario.plannedAssetSales?.some(s => s.id === sale.id)) {
      // Update existing sale
      const index = updatedScenario.plannedAssetSales.findIndex(s => s.id === sale.id);
      if (index !== -1) {
        updatedScenario.plannedAssetSales[index] = sale;
      }
    } else {
      // Add new sale (either from duplicate or new)
      updatedScenario.plannedAssetSales = [...(updatedScenario.plannedAssetSales || []), sale];
    }
    
    setScenario(updatedScenario);
    handlePlannedAssetSaleDialogClose();
  };

  const handleEditPlannedAssetSale = (sale: PlannedAssetSale) => {
    setEditingPlannedAssetSale(sale);
    setIsPlannedAssetSaleDialogOpen(true);
  };

  const handleAddPlannedAssetSale = () => {
    setEditingPlannedAssetSale(undefined);
    setIsPlannedAssetSaleDialogOpen(true);
  };

  const removePlannedAssetSale = (id: string) => {
    const updatedScenario = deepClone(scenario);
    updatedScenario.plannedAssetSales = updatedScenario.plannedAssetSales.filter(s => s.id !== id);
    setScenario(updatedScenario);
  };

  const handlePlannedAssetSaleDialogClose = () => {
    setIsPlannedAssetSaleDialogOpen(false);
    setEditingPlannedAssetSale(undefined);
  };

  const duplicatePlannedAssetSale = (sale: PlannedAssetSale) => {
    const duplicatedSale = { ...sale, id: uuidv4() };
    setEditingPlannedAssetSale(duplicatedSale);
    setIsPlannedAssetSaleDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{isCreating ? 'Create Scenario' : 'Edit Scenario'}</h1>
          <p className="text-muted-foreground mt-2">
            {isCreating ? 'Configure your new scenario details and settings' : 'Configure your scenario details and settings'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/scenarios')}
        >
          Back to Scenarios
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="qualitative">Qualitative</TabsTrigger>
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
                  value={scenario.name}
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
                    value={scenario.location?.country || ''}
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
                    value={scenario.location?.state || ''}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    onBlur={(e) => {
                      const updatedScenario = { ...scenario };
                      updatedScenario.location = {
                        ...updatedScenario.location,
                        state: e.target.value
                      };
                      setScenario(updatedScenario);
                      if (id && id !== 'new') {
                        updateScenario(id, convertFormScenarioToScenario(updatedScenario));
                      }
                    }}
                    placeholder="Enter state/province (optional)"
                  />
                </FormField>

                <FormField
                  id="city"
                  label="City"
                >
                  <Input
                    value={scenario.location?.city || ''}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    onBlur={(e) => {
                      const updatedScenario = { ...scenario };
                      updatedScenario.location = {
                        ...updatedScenario.location,
                        city: e.target.value
                      };
                      setScenario(updatedScenario);
                      if (id && id !== 'new') {
                        updateScenario(id, convertFormScenarioToScenario(updatedScenario));
                      }
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
                    value={scenario.projectionPeriod || ''}
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
                    value={scenario.residencyStartDate ? new Date(scenario.residencyStartDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFieldChange('residencyStartDate', new Date(e.target.value))}
                    onBlur={(e) => handleFieldBlur('residencyStartDate', new Date(e.target.value))}
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
                  value={scenario.tax?.capitalGains?.shortTermRate || ''}
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
                  value={scenario.tax?.capitalGains?.longTermRate || ''}
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
                  value={scenario.tax?.incomeRate || ''}
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
            scenarioId={scenario.id}
            disabled={false}
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
            hasItems={(scenario.plannedAssetSales?.length ?? 0) > 0}
            emptyMessage="No planned asset sales added yet. Add your first planned sale to get started."
          >
            {plannedAssetSaleView === 'card' ? (
              <CardList>
                {(scenario.plannedAssetSales || []).map((sale) => {
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
                      onDelete={() => removePlannedAssetSale(sale.id)}
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
                {(scenario.plannedAssetSales || []).map((sale) => {
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
                      onDelete={() => removePlannedAssetSale(sale.id)}
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
            hasItems={(scenario.annualExpenses?.length ?? 0) > 0}
            emptyMessage="No annual expenses added yet. Add your first annual expense to get started."
          >
            {annualExpenseView === 'card' ? (
              <CardList>
                {scenario.annualExpenses?.map((expense) => (
                  <ListItemCard
                    key={expense.id}
                    title={expense.name}
                    lines={[
                      formatCurrency(expense.amount) + '/year'
                    ]}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => removeExpense(expense.id, 'annual')}
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
                {scenario.annualExpenses?.map((expense) => (
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
                    onDelete={() => removeExpense(expense.id, 'annual')}
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
            hasItems={(scenario.oneTimeExpenses?.length ?? 0) > 0}
            emptyMessage="No one-time expenses added yet. Add your first one-time expense to get started."
          >
            {oneTimeExpenseView === 'card' ? (
              <CardList>
                {scenario.oneTimeExpenses?.map((expense) => (
                  <ListItemCard
                    key={expense.id}
                    title={expense.name}
                    lines={[
                      `${formatCurrency(expense.amount)} in ${expense.year}`
                    ]}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => removeExpense(expense.id, 'oneTime')}
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
                {scenario.oneTimeExpenses?.map((expense) => (
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
                    onDelete={() => removeExpense(expense.id, 'oneTime')}
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
            hasItems={(scenario.incomeSources?.length ?? 0) > 0}
            emptyMessage="No income sources added yet. Add your first income source to get started."
          >
            {incomeSourceView === 'card' ? (
              <CardList>
                {scenario.incomeSources?.map((source) => (
                  <ListItemCard
                    key={source.id}
                    title={source.name}
                    lines={[
                      formatCurrency(source.annualAmount) + '/year',
                      `${source.startYear} - ${source.endYear || 'Ongoing'}`
                    ]}
                    onEdit={() => handleEditIncomeSource(source)}
                    onDelete={() => removeIncomeSource(source.id)}
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
                {scenario.incomeSources?.map((source) => (
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
                    onDelete={() => removeIncomeSource(source.id)}
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
        mode={!editingIncomeSource ? 'add' : scenario.incomeSources?.some(s => s.id === editingIncomeSource.id) ? 'edit' : 'duplicate'}
        onSave={handleIncomeSourceSave}
      />

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={handleExpenseDialogClose}
        expense={editingExpense}
        type={expenseType}
        mode={!editingExpense ? 'add' : (scenario.annualExpenses?.some(e => e.id === editingExpense.id) || scenario.oneTimeExpenses?.some(e => e.id === editingExpense.id)) ? 'edit' : 'duplicate'}
        onSave={handleExpenseSave}
      />

      <PlannedAssetSaleDialog
        open={isPlannedAssetSaleDialogOpen}
        onOpenChange={handlePlannedAssetSaleDialogClose}
        onSave={handlePlannedAssetSaleSave}
        sale={editingPlannedAssetSale}
        mode={!editingPlannedAssetSale ? 'add' : scenario.plannedAssetSales?.some(s => s.id === editingPlannedAssetSale.id) ? 'edit' : 'duplicate'}
        assets={initialAssets}
        projectionPeriod={scenario.projectionPeriod ?? 0}
      />

      <CopyItemsDialog
        open={isCopyDialogOpen}
        onOpenChange={handleCopyDialogClose}
        onSave={handleCopyItemsSave}
        scenarios={scenarios}
        currentScenarioId={scenario.id}
        type={copyDialogType}
        assets={initialAssets}
      />
    </div>
  );
} 