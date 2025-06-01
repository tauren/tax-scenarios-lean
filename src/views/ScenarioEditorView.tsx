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

export function ScenarioEditorView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addScenario } = useUserAppState();
  const [scenario, setScenario] = useState<Partial<Scenario>>({
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
      setScenario({
        ...state.template,
        name: `Baseline: ${state.template.location.country}`,
      });
    } else if (state?.isCustom) {
      setScenario({
        ...scenario,
        name: 'Custom Baseline',
      });
    }
  }, [location.state]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!scenario.name?.trim()) {
      newErrors.name = 'Scenario name is required';
    }

    if (!scenario.location?.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!scenario.projectionPeriod || scenario.projectionPeriod <= 0) {
      newErrors.projectionPeriod = 'Projection period must be greater than 0';
    }

    if (!scenario.residencyStartDate) {
      newErrors.residencyStartDate = 'Residency start date is required';
    }

    const shortTermRate = scenario.tax?.capitalGains?.shortTermRate;
    if (shortTermRate === undefined || shortTermRate < 0 || shortTermRate > 100) {
      newErrors.shortTermRate = 'Short term rate must be between 0 and 100';
    }

    const longTermRate = scenario.tax?.capitalGains?.longTermRate;
    if (longTermRate === undefined || longTermRate < 0 || longTermRate > 100) {
      newErrors.longTermRate = 'Long term rate must be between 0 and 100';
    }

    if (!scenario.incomeSources?.length) {
      newErrors.incomeSources = 'At least one income source is required';
    }

    if (!scenario.annualExpenses?.length) {
      newErrors.annualExpenses = 'At least one annual expense is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    addScenario(scenario as Scenario, { isBaseline: true });
    navigate('/'); // Navigate back to main view
  };

  const handleIncomeSourceSave = (incomeSource: ScenarioIncomeSource) => {
    if (incomeSourceDialog.incomeSource) {
      // Update existing income source
      setScenario({
        ...scenario,
        incomeSources: scenario.incomeSources?.map((source) =>
          source.id === incomeSource.id ? incomeSource : source
        ),
      });
    } else {
      // Add new income source
      setScenario({
        ...scenario,
        incomeSources: [...(scenario.incomeSources || []), { ...incomeSource, id: uuidv4() }],
      });
    }
  };

  const handleExpenseSave = (expense: AnnualExpense | OneTimeExpense) => {
    if (expenseDialog.expense) {
      // Update existing expense
      if (expenseDialog.type === 'annual') {
        const updatedExpenses: AnnualExpense[] = scenario.annualExpenses?.map((exp) =>
          exp.id === expense.id ? expense as AnnualExpense : exp
        ) || [];
        setScenario({
          ...scenario,
          annualExpenses: updatedExpenses,
        });
      } else {
        const updatedOneTimeExpenses: OneTimeExpense[] = scenario.oneTimeExpenses?.map((exp) =>
          exp.id === expense.id ? expense as OneTimeExpense : exp
        ) || [];
        setScenario({
          ...scenario,
          oneTimeExpenses: updatedOneTimeExpenses,
        });
      }
    } else {
      // Add new expense
      if (expenseDialog.type === 'annual') {
        const newExpenses: AnnualExpense[] = [...(scenario.annualExpenses || []), expense as AnnualExpense];
        setScenario({
          ...scenario,
          annualExpenses: newExpenses,
        });
      } else {
        const newOneTimeExpenses: OneTimeExpense[] = [...(scenario.oneTimeExpenses || []), expense as OneTimeExpense];
        setScenario({
          ...scenario,
          oneTimeExpenses: newOneTimeExpenses,
        });
      }
    }
  };

  const duplicateIncomeSource = (incomeSource: ScenarioIncomeSource) => {
    setScenario({
      ...scenario,
      incomeSources: [
        ...(scenario.incomeSources || []),
        { ...incomeSource, id: uuidv4() },
      ],
    });
  };

  const duplicateExpense = (expense: AnnualExpense | OneTimeExpense, type: 'annual' | 'oneTime') => {
    if (type === 'annual') {
      setScenario({
        ...scenario,
        annualExpenses: [...(scenario.annualExpenses || []), { ...expense as AnnualExpense, id: uuidv4() }],
      });
    } else {
      setScenario({
        ...scenario,
        oneTimeExpenses: [...(scenario.oneTimeExpenses || []), { ...expense as OneTimeExpense, id: uuidv4() }],
      });
    }
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField id="scenario-name" label="Scenario Name" error={errors.name}>
              <Input
                id="scenario-name"
                value={scenario.name}
                onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
                placeholder="Enter scenario name"
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField id="country" label="Country" error={errors.country}>
              <Input
                id="country"
                value={scenario.location?.country}
                onChange={(e) =>
                  setScenario({
                    ...scenario,
                    location: { ...scenario.location!, country: e.target.value },
                  })
                }
                placeholder="Enter country"
                className={errors.country ? 'border-destructive' : ''}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="state" label="State/Province (Optional)">
              <Input
                id="state"
                value={scenario.location?.state}
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
                value={scenario.location?.city}
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
                placeholder="Enter rate"
                className={errors.longTermRate ? 'border-destructive' : ''}
              />
            </FormField>
          </div>
        </Section>

        <Section 
          title="Income Sources"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIncomeSourceDialog({ open: true })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Income Source
            </Button>
          }
        >
          {errors.incomeSources && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{errors.incomeSources}</AlertDescription>
            </Alert>
          )}

          <CardList>
            {scenario.incomeSources?.map((source) => (
              <Card key={source.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-medium">{source.name}</h4>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>{source.type}</span>
                        <span>•</span>
                        <span>${source.annualAmount.toLocaleString()}/year</span>
                        <span>•</span>
                        <span>{source.startYear} - {source.endYear || 'Ongoing'}</span>
                      </div>
                    </div>
                    <CardActions
                      onEdit={() => setIncomeSourceDialog({ open: true, incomeSource: source })}
                      onDuplicate={() => duplicateIncomeSource(source)}
                      onDelete={() => removeIncomeSource(source.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardList>
        </Section>

        <Section 
          title="Annual Expenses"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExpenseDialog({ open: true, type: 'annual' })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Annual Expense
            </Button>
          }
        >
          {errors.annualExpenses && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{errors.annualExpenses}</AlertDescription>
            </Alert>
          )}

          <CardList>
            {scenario.annualExpenses?.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-medium">{expense.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        ${expense.amount.toLocaleString()}/year
                      </div>
                    </div>
                    <CardActions
                      onEdit={() => setExpenseDialog({ open: true, expense, type: 'annual' })}
                      onDuplicate={() => duplicateExpense(expense, 'annual')}
                      onDelete={() => removeExpense(expense.id, 'annual')}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardList>
        </Section>

        <Section 
          title="One-Time Expenses"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExpenseDialog({ open: true, type: 'oneTime' })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add One-Time Expense
            </Button>
          }
        >
          {errors.oneTimeExpenses && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{errors.oneTimeExpenses}</AlertDescription>
            </Alert>
          )}

          <CardList>
            {scenario.oneTimeExpenses?.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-medium">{expense.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        ${expense.amount.toLocaleString()} in {(expense as OneTimeExpense).year}
                      </div>
                    </div>
                    <CardActions
                      onEdit={() => setExpenseDialog({ open: true, expense, type: 'oneTime' })}
                      onDuplicate={() => duplicateExpense(expense, 'oneTime')}
                      onDelete={() => removeExpense(expense.id, 'oneTime')}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardList>
        </Section>
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