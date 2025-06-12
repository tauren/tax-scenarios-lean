import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScenarioSummaryHeader from '../components/scenario-detail/ScenarioSummaryHeader';
import ViewActions from '../components/scenario-detail/ViewActions';
import FinancialTimelineChart from '../components/scenario-detail/FinancialTimelineChart';
import YearlyBreakdownTable from '../components/scenario-detail/YearlyBreakdownTable';
import QualitativeAssessmentPanel from '../components/scenario-detail/QualitativeAssessmentPanel';
import QualitativeAttributeMappingPanel from '../components/scenario-detail/QualitativeAttributeMappingPanel';
import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { calculateScenarioResults } from '@/services/calculationService';
import type { ScenarioResults } from '@/types';

const ScenarioDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scenarios, userQualitativeGoals, initialAssets } = useUserAppState();
  const { setScenarioResults } = useCalculationState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get scenario directly from store
  const scenario = scenarios.find(s => s.id === id) || null;
  
  // Get or calculate results
  const [results, setLocalResults] = useState<ScenarioResults | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid scenario ID');
      setLoading(false);
      return;
    }

    if (!scenario) {
      setError('Scenario not found');
      setLoading(false);
      return;
    }

    try {
      // Always recalculate results when scenario changes
      const calculatedResults = calculateScenarioResults(scenario, initialAssets, userQualitativeGoals);
      setScenarioResults(id, calculatedResults);
      setLocalResults(calculatedResults);
      setError(null);
    } catch (e) {
      setError('Failed to calculate scenario results');
      console.error('Error calculating scenario results:', e);
    } finally {
      setLoading(false);
    }
  }, [id, scenario, initialAssets, userQualitativeGoals, setScenarioResults]);

  if (loading) {
    return <div className="p-8 text-center">Loading scenario...</div>;
  }

  if (error || !scenario || !results) {
    return <div className="p-8 text-center text-destructive">{error || 'Scenario not found or failed to load.'}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <ScenarioSummaryHeader scenario={scenario} results={results} />
      <ViewActions onEdit={() => navigate(`/scenarios/${id}/edit`)} onBack={() => navigate('/overview')} />
      <FinancialTimelineChart results={results} />
      <YearlyBreakdownTable results={results} />
      <QualitativeAssessmentPanel results={results} goals={userQualitativeGoals} />
      <QualitativeAttributeMappingPanel scenario={scenario} goals={userQualitativeGoals} />
    </div>
  );
};

export default ScenarioDetailView; 