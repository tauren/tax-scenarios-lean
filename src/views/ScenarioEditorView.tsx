import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { Scenario, IncomeSource, AnnualExpense, OneTimeExpense, PlannedAssetSale, Asset } from '@/types';
import type { ScenarioValidationErrors } from '@/types/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { IncomeSourceDialog } from '@/components/dialogs/IncomeSourceDialog';
import { ExpenseDialog } from '@/components/dialogs/ExpenseDialog';
import { CopyItemsDialog } from '@/components/dialogs/CopyItemsDialog';
import { Section } from '@/components/shared/Section';
import { FormField } from '@/components/shared/FormField';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { deepClone } from '@/utils/clone';
import { toDateInputValue } from '@/utils/date';
import { TableList } from '@/components/shared/TableList';
import { TableListItem } from '@/components/shared/TableListItem';
import { CardList } from '@/components/shared/CardList';
import { INCOME_SOURCE_TYPE_LABELS } from '@/types';
import { PlannedAssetSaleDialog } from '@/components/dialogs/PlannedAssetSaleDialog';

interface ValidationErrors {
  [key: string]: string | undefined;
  name?: string;
  country?: string;
  projectionPeriod?: string;
  residencyStartDate?: string;
  shortTermRate?: string;
  longTermRate?: string;
  incomeSources?: string;
  annualExpenses?: string;
  oneTimeExpenses?: string;
}

type ValidationField = keyof ValidationErrors;

interface ValidationRule {
  field: ValidationField;
  validate: (value: any) => string | undefined;
  getValue: (scenario: Partial<Scenario>) => any;
}

const validationRules: ValidationRule[] = [
  {
    field: 'name',
    validate: (value) => !value?.trim() ? 'Please enter a name for this scenario' : undefined,
    getValue: (scenario) => scenario.name
  },
  {
    field: 'country',
    validate: (value) => !value?.trim() ? 'Please select a country for this scenario' : undefined,
    getValue: (scenario) => scenario.location?.country
  },
  {
    field: 'projectionPeriod',
    validate: (value) => !value || value <= 0 ? 'Projection period must be at least 1 year' : undefined,
    getValue: (scenario) => scenario.projectionPeriod
  },
  {
    field: 'residencyStartDate',
    validate: (value) => !value ? 'Please select a residency start date' : undefined,
    getValue: (scenario) => scenario.residencyStartDate
  },
  {
    field: 'shortTermRate',
    validate: (value) => value === undefined || value < 0 || value > 100 
      ? 'Short term rate must be between 0% and 100%' 
      : undefined,
    getValue: (scenario) => scenario.tax?.capitalGains?.shortTermRate
  },
  {
    field: 'longTermRate',
    validate: (value) => value === undefined || value < 0 || value > 100 
      ? 'Long term rate must be between 0% and 100%' 
      : undefined,
    getValue: (scenario) => scenario.tax?.capitalGains?.longTermRate
  },
  {
    field: 'incomeSources',
    validate: (sources: IncomeSource[] | undefined) => {
      if (!sources?.length) return undefined; // Income sources are optional
      
      const hasValidSource = sources.every((source: IncomeSource) => {
        if (!source.name?.trim()) return false;
        if (!source.annualAmount || source.annualAmount <= 0) return false;
        if (!source.startYear || source.startYear < new Date().getFullYear()) return false;
        if (source.endYear && source.endYear < source.startYear) return false;
        return true;
      });

      return hasValidSource ? undefined : 'All income sources must have valid details';
    },
    getValue: (scenario) => scenario.incomeSources
  },
  {
    field: 'annualExpenses',
    validate: (expenses: AnnualExpense[] | undefined) => {
      if (!expenses?.length) return undefined; // Annual expenses are optional
      
      const hasValidExpense = expenses.every((expense: AnnualExpense) => {
        if (!expense.name?.trim()) return false;
        if (!expense.amount || expense.amount <= 0) return false;
        return true;
      });

      return hasValidExpense ? undefined : 'All annual expenses must have valid details';
    },
    getValue: (scenario) => scenario.annualExpenses
  },
  {
    field: 'oneTimeExpenses',
    validate: (expenses: OneTimeExpense[] | undefined) => {
      if (!expenses?.length) return undefined; // One-time expenses are optional
      
      const currentYear = new Date().getFullYear();
      const hasValidExpense = expenses.every((expense: OneTimeExpense) => {
        if (!expense.name?.trim()) return false;
        if (!expense.amount || expense.amount <= 0) return false;
        if (!expense.year || expense.year < currentYear) return false;
        return true;
      });

      return hasValidExpense ? undefined : 'All one-time expenses must have valid details';
    },
    getValue: (scenario) => scenario.oneTimeExpenses
  }
];

export function ScenarioEditorView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addScenario, updateScenario, scenarios, initialAssets } = useUserAppState();
  const [scenario, setScenario] = useState<Scenario>({
    id: uuidv4(),
    name: '',
    projectionPeriod: 30,
    residencyStartDate: new Date(),
    location: {
      country: '',
      state: '',
      city: '',
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0,
      },
    },
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    plannedAssetSales: [],
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
        setScenario(deepClone(existingScenario));
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
        const newScenario = {
          ...templateCopy,
          id: uuidv4(), // Ensure new ID for new scenario
          name: templateCopy.name || templateCopy.location.country,
          projectionPeriod: templateCopy.projectionPeriod || 10,
          residencyStartDate: templateCopy.residencyStartDate instanceof Date ? templateCopy.residencyStartDate : new Date(),
          location: {
            country: templateCopy.location?.country || '',
            state: templateCopy.location?.state || '',
            city: templateCopy.location?.city || '',
          },
          tax: {
            capitalGains: {
              shortTermRate: templateCopy.tax?.capitalGains?.shortTermRate || 0,
              longTermRate: templateCopy.tax?.capitalGains?.longTermRate || 0,
              specialConditions: templateCopy.tax?.capitalGains?.specialConditions,
            },
          },
          // Use the deep cloned arrays directly
          incomeSources: templateCopy.incomeSources,
          annualExpenses: templateCopy.annualExpenses,
          oneTimeExpenses: templateCopy.oneTimeExpenses,
          plannedAssetSales: templateCopy.plannedAssetSales,
        };
        setScenario(newScenario);
      }
    }
  }, [id, location.state, location.pathname, scenarios, navigate]);

  const validateField = (field: ValidationField, value: any): string | undefined => {
    const rule = validationRules.find(r => r.field === field);
    if (!rule) return undefined;

    const error = rule.validate(value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
    return error;
  };

  const handleFieldBlur = (field: ValidationField, value: any) => {
    validateField(field, value);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate each field using the validation rules
    validationRules.forEach(rule => {
      const value = rule.getValue(scenario);
      const error = rule.validate(value);
      if (error) {
        newErrors[rule.field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    validateForm();
  }, [scenario]);

  const handleSave = () => {
    if (!validateForm()) return;

    // Ensure all required fields are present and properly typed
    const scenarioToSave: Scenario = {
      id: scenario.id, // Keep the existing ID
      name: scenario.name || '',
      projectionPeriod: scenario.projectionPeriod || 30,
      residencyStartDate: scenario.residencyStartDate!, // We know this is valid because of validation
      location: {
        country: scenario.location?.country || '',
        state: scenario.location?.state || '',
        city: scenario.location?.city || '',
      },
      tax: {
        capitalGains: {
          shortTermRate: scenario.tax?.capitalGains?.shortTermRate || 0,
          longTermRate: scenario.tax?.capitalGains?.longTermRate || 0,
          specialConditions: scenario.tax?.capitalGains?.specialConditions,
        },
      },
      incomeSources: scenario.incomeSources || [],
      annualExpenses: scenario.annualExpenses || [],
      oneTimeExpenses: scenario.oneTimeExpenses || [],
      plannedAssetSales: scenario.plannedAssetSales || [],
    };

    if (id && id !== 'new') {
      // Update existing scenario
      updateScenario(id, scenarioToSave);
    } else {
      // Create new scenario
      addScenario(scenarioToSave);
    }
    navigate('/scenarios');
  };

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
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/scenarios')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={hasErrors}>
            {isCreating ? 'Create Scenario' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Basic Information">
          <div className="grid gap-4">
            <FormField
              id="name"
              label="Scenario Name"
              error={errors.name}
            >
              <Input
                id="name"
                name="name"
                value={scenario.name}
                onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
                onBlur={() => handleFieldBlur('name', scenario.name)}
                placeholder="Enter scenario name"
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                id="country"
                label="Country"
                error={errors.country}
              >
                <Input
                  id="country"
                  name="country"
                  value={scenario.location?.country}
                  onChange={(e) => setScenario({
                    ...scenario,
                    location: {
                      country: e.target.value,
                      state: scenario.location?.state,
                      city: scenario.location?.city
                    }
                  })}
                  onBlur={() => handleFieldBlur('country', scenario.location?.country)}
                  placeholder="Enter country"
                  className={errors.country ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField
                id="state"
                label="State/Province"
              >
                <Input
                  id="state"
                  name="state"
                  value={scenario.location?.state}
                  onChange={(e) => setScenario({
                    ...scenario,
                    location: {
                      country: scenario.location?.country || '',
                      state: e.target.value,
                      city: scenario.location?.city
                    }
                  })}
                  placeholder="Enter state/province (optional)"
                />
              </FormField>

              <FormField
                id="city"
                label="City"
              >
                <Input
                  id="city"
                  name="city"
                  value={scenario.location?.city}
                  onChange={(e) => setScenario({
                    ...scenario,
                    location: {
                      country: scenario.location?.country || '',
                      state: scenario.location?.state,
                      city: e.target.value
                    }
                  })}
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
                  id="projectionPeriod"
                  name="projectionPeriod"
                  type="number"
                  min="1"
                  value={scenario.projectionPeriod}
                  onChange={(e) => setScenario({
                    ...scenario,
                    projectionPeriod: Number(e.target.value)
                  })}
                  onBlur={() => handleFieldBlur('projectionPeriod', scenario.projectionPeriod)}
                  className={errors.projectionPeriod ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField
                id="residencyStartDate"
                label="Residency Start Date"
                error={errors.residencyStartDate}
              >
                <Input
                  id="residencyStartDate"
                  name="residencyStartDate"
                  type="date"
                  value={toDateInputValue(scenario.residencyStartDate)}
                  onChange={e => {
                    const date = e.target.value ? new Date(e.target.value) : new Date();
                    setScenario({ ...scenario, residencyStartDate: date });
                    handleFieldBlur('residencyStartDate', date);
                  }}
                  onBlur={() => handleFieldBlur('residencyStartDate', scenario.residencyStartDate)}
                  className={errors.residencyStartDate ? 'border-destructive' : ''}
                />
              </FormField>
            </div>
          </div>
        </Section>

        <Section title="Capital Gains Tax Rates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="shortTermRate"
              label="Short-Term Capital Gains Tax Rate (%)"
              error={errors.shortTermRate}
            >
              <Input
                id="shortTermRate"
                name="shortTermRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={scenario.tax?.capitalGains?.shortTermRate}
                onChange={(e) => setScenario({
                  ...scenario,
                  tax: {
                    ...scenario.tax,
                    capitalGains: {
                      shortTermRate: Number(e.target.value),
                      longTermRate: scenario.tax?.capitalGains?.longTermRate || 0
                    }
                  }
                })}
                onBlur={() => handleFieldBlur('shortTermRate', scenario.tax?.capitalGains?.shortTermRate)}
                className={errors.shortTermRate ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="longTermRate"
              label="Long-Term Capital Gains Tax Rate (%)"
              error={errors.longTermRate}
            >
              <Input
                id="longTermRate"
                name="longTermRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={scenario.tax?.capitalGains?.longTermRate}
                onChange={(e) => setScenario({
                  ...scenario,
                  tax: {
                    ...scenario.tax,
                    capitalGains: {
                      shortTermRate: scenario.tax?.capitalGains?.shortTermRate || 0,
                      longTermRate: Number(e.target.value)
                    }
                  }
                })}
                onBlur={() => handleFieldBlur('longTermRate', scenario.tax?.capitalGains?.longTermRate)}
                className={errors.longTermRate ? 'border-destructive' : ''}
              />
            </FormField>
          </div>
        </Section>

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
      </div>

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
        projectionPeriod={scenario.projectionPeriod}
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