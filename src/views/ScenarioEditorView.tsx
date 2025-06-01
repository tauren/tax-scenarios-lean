import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { Scenario, IncomeSource, AnnualExpense, OneTimeExpense } from '@/types';
import type { ScenarioValidationErrors } from '@/types/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { IncomeSourceDialog } from '@/components/dialogs/IncomeSourceDialog';
import { ExpenseDialog } from '@/components/dialogs/ExpenseDialog';
import { Section } from '@/components/shared/section';
import { FormField } from '@/components/shared/form-field';
import { CardList } from '@/components/shared/card-list';
import { ListItemCard } from '@/components/shared/list-item-card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { deepClone } from '@/lib/utils/clone';

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
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addScenario } = useUserAppState();
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
  });
  const [errors, setErrors] = useState<ScenarioValidationErrors>({});
  const [isIncomeSourceDialogOpen, setIsIncomeSourceDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingIncomeSource, setEditingIncomeSource] = useState<IncomeSource | undefined>();
  const [editingExpense, setEditingExpense] = useState<AnnualExpense | OneTimeExpense | undefined>();
  const [expenseType, setExpenseType] = useState<'annual' | 'oneTime'>('annual');

  useEffect(() => {
    // If we have a template from the previous view, use it
    const state = location.state as { template?: Scenario; isCustom?: boolean };
    if (state?.template) {
      // Deep copy the template scenario
      const templateCopy = deepClone(state.template);
      setScenario({
        ...templateCopy,
        id: uuidv4(), // Ensure new ID
        name: `Baseline: ${templateCopy.location.country}`,
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
        incomeSources: templateCopy.incomeSources || [],
        annualExpenses: templateCopy.annualExpenses || [],
        oneTimeExpenses: templateCopy.oneTimeExpenses || [],
      });
    } else if (state?.isCustom) {
      setScenario(prev => ({
        ...prev,
        id: uuidv4(), // Ensure new ID
        name: 'Custom Baseline',
      }));
    }
  }, [location.state]);

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
    if (!validateForm()) {
      return;
    }

    // Ensure all required fields are present and properly typed
    const scenarioToSave: Scenario = {
      id: scenario.id || uuidv4(),
      name: scenario.name || '',
      projectionPeriod: scenario.projectionPeriod || 30,
      residencyStartDate: scenario.residencyStartDate instanceof Date ? scenario.residencyStartDate : new Date(),
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
    };

    addScenario(scenarioToSave, { isBaseline: true });
    navigate('/'); // Navigate back to main view
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

  const duplicateIncomeSource = (incomeSource: IncomeSource) => {
    const duplicatedSource = { ...incomeSource, id: uuidv4() };
    setIsIncomeSourceDialogOpen(true);
    setEditingIncomeSource(duplicatedSource);
  };

  const duplicateExpense = (expense: AnnualExpense | OneTimeExpense, type: 'annual' | 'oneTime') => {
    const duplicatedExpense = { ...expense, id: uuidv4() };
    setIsExpenseDialogOpen(true);
    setEditingExpense(duplicatedExpense);
    setExpenseType(type);
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Scenario</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (!hasErrors) {
          handleSave();
        }
      }}>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="residencyStartDate"
                        name="residencyStartDate"
                        variant="outline"
                        type="button"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scenario.residencyStartDate && "text-muted-foreground",
                          errors.residencyStartDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scenario.residencyStartDate ? (
                          format(scenario.residencyStartDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto p-0" 
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Calendar
                        mode="single"
                        selected={scenario.residencyStartDate}
                        onSelect={(date: Date | undefined) => {
                          setScenario({ ...scenario, residencyStartDate: date });
                          handleFieldBlur('residencyStartDate', date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>
              </div>
            </div>
          </Section>

          <Section 
            title="Capital Gains Tax Rates"
          >
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
            actionLabel="Add Income Source"
            onAction={() => {
              setEditingIncomeSource(undefined);
              setIsIncomeSourceDialogOpen(true);
            }}
            error={errors.incomeSources}
            hasItems={(scenario.incomeSources?.length ?? 0) > 0}
            emptyMessage="No income sources added yet. Add your first income source to get started."
          >
            <CardList>
              {scenario.incomeSources?.map((source) => (
                <ListItemCard
                  key={source.id}
                  title={source.name}
                  subtitle={`${formatCurrency(source.annualAmount)}/year • ${source.startYear} - ${source.endYear || 'Ongoing'}`}
                  onEdit={() => {
                    setIsIncomeSourceDialogOpen(true);
                    setEditingIncomeSource(source);
                  }}
                  onDelete={() => removeIncomeSource(source.id)}
                  onDuplicate={() => duplicateIncomeSource(source)}
                />
              ))}
            </CardList>
          </Section>

          <Section
            title="Annual Expenses"
            actionLabel="Add Annual Expense"
            onAction={() => {
              setEditingExpense(undefined);
              setExpenseType('annual');
              setIsExpenseDialogOpen(true);
            }}
            error={errors.annualExpenses}
            hasItems={(scenario.annualExpenses?.length ?? 0) > 0}
            emptyMessage="No annual expenses added yet. Add your first annual expense to get started."
          >
            <CardList>
              {scenario.annualExpenses?.map((expense) => (
                <ListItemCard
                  key={expense.id}
                  title={expense.name}
                  subtitle={formatCurrency(expense.amount)}
                  onEdit={() => {
                    setIsExpenseDialogOpen(true);
                    setEditingExpense(expense);
                    setExpenseType('annual');
                  }}
                  onDelete={() => removeExpense(expense.id, 'annual')}
                  onDuplicate={() => duplicateExpense(expense, 'annual')}
                />
              ))}
            </CardList>
          </Section>

          <Section
            title="One-Time Expenses"
            actionLabel="Add One-Time Expense"
            onAction={() => {
              setEditingExpense(undefined);
              setExpenseType('oneTime');
              setIsExpenseDialogOpen(true);
            }}
            error={errors.oneTimeExpenses}
            hasItems={(scenario.oneTimeExpenses?.length ?? 0) > 0}
            emptyMessage="No one-time expenses added yet. Add your first one-time expense to get started."
          >
            <CardList>
              {scenario.oneTimeExpenses?.map((expense) => (
                <ListItemCard
                  key={expense.id}
                  title={expense.name}
                  subtitle={`${formatCurrency(expense.amount)} in ${expense.year}`}
                  onEdit={() => {
                    setIsExpenseDialogOpen(true);
                    setEditingExpense(expense);
                    setExpenseType('oneTime');
                  }}
                  onDelete={() => removeExpense(expense.id, 'oneTime')}
                  onDuplicate={() => duplicateExpense(expense, 'oneTime')}
                />
              ))}
            </CardList>
          </Section>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={hasErrors}>
            Save Scenario
          </Button>
        </div>
      </form>

      <IncomeSourceDialog
        isOpen={isIncomeSourceDialogOpen}
        onClose={() => setIsIncomeSourceDialogOpen(false)}
        incomeSource={editingIncomeSource}
        onSave={handleIncomeSourceSave}
      />

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={(open) => setIsExpenseDialogOpen(open)}
        expense={editingExpense}
        type={expenseType}
        onSave={handleExpenseSave}
      />
    </div>
  );
} 