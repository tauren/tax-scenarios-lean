import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { BadgeCheck, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting';
import { useNavigate } from 'react-router-dom';

export function ScenarioSummaryDashboard() {
  const { scenarios } = useUserAppState();
  const { resultsByScenario } = useCalculationState();
  const navigate = useNavigate();

  // Find scenario with best qualitative fit
  const bestQualitativeFitScenario = scenarios.reduce((best, s) => {
    const score = resultsByScenario[s.id]?.qualitativeFitScore || 0;
    if (!best || score > (resultsByScenario[best.id]?.qualitativeFitScore || 0)) return s;
    return best;
  }, null as typeof scenarios[0] | null);
  const bestQualitativeScore = bestQualitativeFitScenario ? (resultsByScenario[bestQualitativeFitScenario.id]?.qualitativeFitScore || 0) : 0;

  // Find scenario with best net outcome
  const getTotalNetFinancialOutcome = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.totalNetFinancialOutcomeOverPeriod;
  };
  const bestNetOutcomeScenario = scenarios.reduce((best, s) => {
    const outcome = getTotalNetFinancialOutcome(s.id);
    if (!best || outcome > getTotalNetFinancialOutcome(best.id)) return s;
    return best;
  }, null as typeof scenarios[0] | null);
  const bestNetOutcome = bestNetOutcomeScenario ? getTotalNetFinancialOutcome(bestNetOutcomeScenario.id) : 0;

  // Progress bar for qualitative fit (out of 100)
  const progressPercent = bestQualitativeScore;

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Best Qualitative Fit */}
      <div 
        className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[180px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => bestQualitativeFitScenario && navigate(`/scenarios/${bestQualitativeFitScenario.id}/view`)}
      >
        <BadgeCheck className="h-6 w-6 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">Best Qualitative Fit</span>
        <span className="text-lg font-bold">{bestQualitativeFitScenario?.name || '—'}</span>
        <span className="text-md">{bestQualitativeScore}/100</span>
        <div className="w-full mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      {/* Best Net Outcome */}
      <div 
        className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[180px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => bestNetOutcomeScenario && navigate(`/scenarios/${bestNetOutcomeScenario.id}/view`)}
      >
        <TrendingUp className="h-6 w-6 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">Best Net Outcome</span>
        <span className="text-lg font-bold">{bestNetOutcomeScenario?.name || '—'}</span>
        <span className="text-md text-green-600">{bestNetOutcome ? formatCurrency(bestNetOutcome) : '—'}</span>
      </div>
    </div>
  );
} 