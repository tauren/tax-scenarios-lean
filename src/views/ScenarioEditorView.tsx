import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { Scenario, ScenarioIncomeSource, AnnualExpense, OneTimeExpense } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { IncomeSourceDialog } from '@/components/dialogs/IncomeSourceDialog';
import { ExpenseDialog } from '@/components/dialogs/ExpenseDialog';
import { Section } from '@/components/shared/section';
import { FormField } from '@/components/shared/form-field';
import { CardList } from '@/components/shared/card-list';
import { CardActions } from '@/components/shared/card-actions';
import { ListItemCard } from '@/components/shared/list-item-card';

interface ValidationErrors {
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
  }
];

export function ScenarioEditorView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addScenario } = useUserAppState();
  const [scenario, setScenario] = useState<Partial<Scenario>>({
    name: '',
    projectionPeriod: 10,
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [incomeSourceDialog, setIncomeSourceDialog] = useState<{
    open: boolean;
    incomeSource?: ScenarioIncomeSource;
  }>({ open: false });
  const [expenseDialog, setExpenseDialog] = useState<{
    open: boolean;
    expense?: AnnualExpense | OneTimeExpense;
    type: 'annual' | 'oneTime';
  }>({ open: false, type: 'annual' });

  useEffect(() => {
    // If we have a template from the previous view, use it
    const state = location.state as { template?: Scenario; isCustom?: boolean };
    if (state?.template) {
      // Deep copy the template scenario
      const templateCopy = JSON.parse(JSON.stringify(state.template)) as Scenario;
      setScenario({
        ...templateCopy,
        id: uuidv4(), // Ensure new ID
        name: `Baseline: ${templateCopy.location.country}`,
        projectionPeriod: templateCopy.projectionPeriod || 10,
        residencyStartDate: templateCopy.residencyStartDate || new Date(),
        location: {
          country: templateCopy.location?.country || '',
          state: templateCopy.location?.state || '',
          city: templateCopy.location?.city || '',
        },
        tax: {
          capitalGains: {
            shortTermRate: templateCopy.tax?.capitalGains?.shortTermRate || 0,
            longTermRate: templateCopy.tax?.capitalGains?.longTermRate || 0,
          },
        },
        incomeSources: templateCopy.incomeSources || [],
        annualExpenses: templateCopy.annualExpenses || [],
        oneTimeExpenses: templateCopy.oneTimeExpenses || [],
      });
    } else if (state?.isCustom) {
      setScenario({
        ...scenario,
        id: uuidv4(), // Ensure new ID
        name: 'Custom Baseline',
      });
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
      residencyStartDate: scenario.residencyStartDate || new Date(),
      location: {
        country: scenario.location?.country || '',
        state: scenario.location?.state || '',
        city: scenario.location?.city || '',
      },
      tax: {
        capitalGains: {
          shortTermRate: scenario.tax?.capitalGains?.shortTermRate || 0,
          longTermRate: scenario.tax?.capitalGains?.longTermRate || 0,
        },
      },
      incomeSources: scenario.incomeSources || [],
      annualExpenses: scenario.annualExpenses || [],
      oneTimeExpenses: scenario.oneTimeExpenses || [],
    };

    addScenario(scenarioToSave, { isBaseline: true });
    navigate('/'); // Navigate back to main view
  };

  const handleIncomeSourceSave = (incomeSource: ScenarioIncomeSource) => {
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
    if (expenseDialog.type === 'annual') {
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

  const duplicateIncomeSource = (incomeSource: ScenarioIncomeSource) => {
    const duplicatedSource = { ...incomeSource, id: uuidv4() };
    setIncomeSourceDialog({ open: true, incomeSource: duplicatedSource });
  };

  const duplicateExpense = (expense: AnnualExpense | OneTimeExpense, type: 'annual' | 'oneTime') => {
    const duplicatedExpense = { ...expense, id: uuidv4() };
    setExpenseDialog({ open: true, expense: duplicatedExpense, type });
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Section title="Scenario Overview">
          <FormField id="scenario-name" label="Scenario Name" error={errors.name}>
            <Input
              id="scenario-name"
              value={scenario.name || ''}
              onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
              onBlur={() => handleFieldBlur('name', scenario.name)}
              placeholder="Enter a descriptive name for this scenario"
              className={`text-lg ${errors.name ? 'border-destructive' : ''}`}
            />
          </FormField>
        </Section>

        <Section title="Location Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField id="country" label="Country" error={errors.country}>
              <Input
                id="country"
                value={scenario.location?.country || ''}
                onChange={(e) =>
                  setScenario({
                    ...scenario,
                    location: { ...scenario.location!, country: e.target.value },
                  })
                }
                onBlur={() => handleFieldBlur('country', scenario.location?.country)}
                placeholder="Enter country"
                className={errors.country ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField id="state" label="State/Province (Optional)">
              <Input
                id="state"
                value={scenario.location?.state || ''}
                onChange={(e) =>
                  setScenario({
                    ...scenario,
                    location: { ...scenario.location!, state: e.target.value },
                  })
                }
                placeholder="Enter state/province"
              />
            </FormField>

            <FormField id="city" label="City (Optional)">
              <Input
                id="city"
                value={scenario.location?.city || ''}
                onChange={(e) =>
                  setScenario({
                    ...scenario,
                    location: { ...scenario.location!, city: e.target.value },
                  })
                }
                placeholder="Enter city"
              />
            </FormField>
          </div>
        </Section>

        <Section title="Projection Settings">
          <div className="grid grid-cols-2 gap-4">
            <FormField id="projection-period" label="Projection Period (Years)" error={errors.projectionPeriod}>
              <Input
                id="projection-period"
                type="number"
                min="1"
                value={scenario.projectionPeriod || ''}
                onChange={(e) =>
                  setScenario({ ...scenario, projectionPeriod: e.target.value ? Number(e.target.value) : 0 })
                }
                onBlur={() => handleFieldBlur('projectionPeriod', scenario.projectionPeriod)}
                className={errors.projectionPeriod ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField id="residency-start-date" label="Residency Start Date" error={errors.residencyStartDate}>
              <Input
                id="residency-start-date"
                type="date"
                value={scenario.residencyStartDate ? scenario.residencyStartDate.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setScenario({ ...scenario, residencyStartDate: new Date(e.target.value) })
                }
                onBlur={() => handleFieldBlur('residencyStartDate', scenario.residencyStartDate)}
                className={errors.residencyStartDate ? 'border-destructive' : ''}
              />
            </FormField>
          </div>
        </Section>

        <Section title="Capital Gains Tax Rates">
          <div className="grid grid-cols-2 gap-4">
            <FormField id="short-term-rate" label="Short Term Rate (%)" error={errors.shortTermRate}>
              <Input
                id="short-term-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={scenario.tax?.capitalGains?.shortTermRate || ''}
                onChange={(e) =>
                  setScenario({
                    ...scenario,
                    tax: {
                      ...scenario.tax!,
                      capitalGains: {
                        ...scenario.tax!.capitalGains!,
                        shortTermRate: e.target.value ? Number(e.target.value) : 0,
                      },
                    },
                  })
                }
                onBlur={() => handleFieldBlur('shortTermRate', scenario.tax?.capitalGains?.shortTermRate)}
                placeholder="Enter rate"
                className={errors.shortTermRate ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField id="long-term-rate" label="Long Term Rate (%)" error={errors.longTermRate}>
              <Input
                id="long-term-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={scenario.tax?.capitalGains?.longTermRate || ''}
                onChange={(e) =>
                  setScenario({
                    ...scenario,
                    tax: {
                      ...scenario.tax!,
                      capitalGains: {
                        ...scenario.tax!.capitalGains!,
                        longTermRate: e.target.value ? Number(e.target.value) : 0,
                      },
                    },
                  })
                }
                onBlur={() => handleFieldBlur('longTermRate', scenario.tax?.capitalGains?.longTermRate)}
                placeholder="Enter rate"
                className={errors.longTermRate ? 'border-destructive' : ''}
              />
            </FormField>
          </div>
        </Section>

        <Section 
          title="Income Sources"
          actionLabel="Add Income Source"
          onAction={() => setIncomeSourceDialog({ open: true })}
          error={errors.incomeSources}
          emptyMessage='No income sources defined. Click "Add Income Source" to get started.'
          hasItems={scenario.incomeSources && scenario.incomeSources.length > 0}
        >
          <CardList>
            {scenario.incomeSources?.map((income) => (
              <ListItemCard
                key={income.id}
                title={income.name}
                subtitle={`${income.type} • ${formatCurrency(income.annualAmount)}/year • ${income.startYear}-${income.endYear}`}
                onEdit={() => setIncomeSourceDialog({ open: true, incomeSource: income })}
                onDelete={() => removeIncomeSource(income.id)}
                onDuplicate={() => duplicateIncomeSource(income)}
              />
            ))}
          </CardList>
        </Section>

        <Section 
          title="Annual Expenses"
          actionLabel="Add Annual Expense"
          onAction={() => setExpenseDialog({ open: true, type: 'annual' })}
          error={errors.annualExpenses}
          emptyMessage='No annual expenses defined. Click "Add Annual Expense" to get started.'
          hasItems={scenario.annualExpenses && scenario.annualExpenses.length > 0}
        >
          <CardList>
            {scenario.annualExpenses?.map((expense) => (
              <ListItemCard
                key={expense.id}
                title={expense.name}
                subtitle={`${formatCurrency(expense.amount)}/year`}
                onEdit={() => setExpenseDialog({ open: true, expense, type: 'annual' })}
                onDelete={() => removeExpense(expense.id, 'annual')}
                onDuplicate={() => duplicateExpense(expense, 'annual')}
              />
            ))}
          </CardList>
        </Section>

        <Section 
          title="One-Time Expenses"
          actionLabel="Add One-Time Expense"
          onAction={() => setExpenseDialog({ open: true, type: 'oneTime' })}
          error={errors.oneTimeExpenses}
          emptyMessage='No one-time expenses defined. Click "Add One-Time Expense" to get started.'
          hasItems={scenario.oneTimeExpenses && scenario.oneTimeExpenses.length > 0}
        >
          <CardList>
            {scenario.oneTimeExpenses?.map((expense) => (
              <ListItemCard
                key={expense.id}
                title={expense.name}
                subtitle={`${formatCurrency(expense.amount)} • Year ${expense.year}`}
                onEdit={() => setExpenseDialog({ open: true, expense, type: 'oneTime' })}
                onDelete={() => removeExpense(expense.id, 'oneTime')}
                onDuplicate={() => duplicateExpense(expense, 'oneTime')}
              />
            ))}
          </CardList>
        </Section>
      </div>

      <div className="max-w-4xl mx-auto mt-8 flex flex-col items-end space-y-4">
        {hasErrors && (
          <Alert variant="destructive" className="w-full">
            <AlertDescription>
              Please fix the form errors before saving
            </AlertDescription>
          </Alert>
        )}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={hasErrors}
          >
            Save Scenario
          </Button>
        </div>
      </div>

      <IncomeSourceDialog
        open={incomeSourceDialog.open}
        onOpenChange={(open) => setIncomeSourceDialog({ open })}
        incomeSource={incomeSourceDialog.incomeSource}
        onSave={handleIncomeSourceSave}
      />

      <ExpenseDialog
        open={expenseDialog.open}
        onOpenChange={(open) => setExpenseDialog({ ...expenseDialog, open })}
        expense={expenseDialog.expense}
        type={expenseDialog.type}
        onSave={handleExpenseSave}
      />
    </div>
  );
} 