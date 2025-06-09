import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScenarioSummaryHeader from '../components/scenario-detail/ScenarioSummaryHeader';
import ViewActions from '../components/scenario-detail/ViewActions';
import FinancialTimelineChart from '../components/scenario-detail/FinancialTimelineChart';
import YearlyBreakdownTable from '../components/scenario-detail/YearlyBreakdownTable';
import QualitativeAssessmentPanel from '../components/scenario-detail/QualitativeAssessmentPanel';
import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { calculateScenarioResults } from '@/services/calculationService';
import type { Scenario, ScenarioResults } from '@/types';

const ScenarioDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scenarios, userQualitativeGoals, initialAssets } = useUserAppState();
  const { resultsByScenario, setScenarioResults } = useCalculationState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [results, setResults] = useState<ScenarioResults | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    const foundScenario = scenarios.find(s => s.id === id) || null;
    let foundResults = resultsByScenario[id] || null;
    // If results are missing but scenario exists, recalculate and set
    if (foundScenario && !foundResults) {
      try {
        foundResults = calculateScenarioResults(foundScenario, initialAssets, userQualitativeGoals);
        setScenarioResults(id, foundResults);
      } catch (e) {
        setError(true);
        setLoading(false);
        return;
      }
    }
    if (!foundScenario || !foundResults) {
      setError(true);
      setLoading(false);
      return;
    }
    setScenario(foundScenario);
    setResults(foundResults);
    setLoading(false);
  }, [id, scenarios, resultsByScenario, userQualitativeGoals, initialAssets, setScenarioResults]);

  if (loading) return <div className="p-8 text-center">Loading scenario...</div>;
  if (error || !scenario || !results) return <div className="p-8 text-center text-destructive">Scenario not found or failed to load.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <ScenarioSummaryHeader scenario={scenario} results={results} />
      <ViewActions onEdit={() => navigate(`/scenarios/${id}/edit`)} onBack={() => navigate('/scenarios')} />
      <FinancialTimelineChart results={results} />
      <YearlyBreakdownTable results={results} />
      <QualitativeAssessmentPanel results={results} goals={userQualitativeGoals} />
    </div>
  );
};

export default ScenarioDetailView; 