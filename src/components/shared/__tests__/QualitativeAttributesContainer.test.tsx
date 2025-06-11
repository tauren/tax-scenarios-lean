import { render, screen, fireEvent } from '@testing-library/react';
import { QualitativeAttributesContainer } from '../QualitativeAttributesContainer';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';
import { useUserAppState } from '@/store/userAppStateSlice';

// Mock the useUserAppState hook
vi.mock('@/store/userAppStateSlice', () => ({
  useUserAppState: vi.fn()
}));

describe('QualitativeAttributesContainer', () => {
  const mockScenarioId = 'scenario-1';
  const mockGoals: UserQualitativeGoal[] = [
    {
      id: 'goal-1',
      conceptId: 'concept-1',
      name: 'Test Goal 1',
      weight: 'High',
    },
    {
      id: 'goal-2',
      conceptId: 'concept-2',
      name: 'Test Goal 2',
      weight: 'Medium',
    },
  ];

  const mockAttributes: ScenarioQualitativeAttribute[] = [
    {
      id: 'attr-1',
      name: 'Test attribute 1',
      sentiment: 'Positive',
      significance: 'High',
      mappedGoalId: 'goal-1'
    },
    {
      id: 'attr-2',
      name: 'Test attribute 2',
      sentiment: 'Neutral',
      significance: 'Medium',
      mappedGoalId: 'goal-2'
    },
  ];

  beforeEach(() => {
    (useUserAppState as any).mockReturnValue({
      scenarios: [{
        id: mockScenarioId,
        scenarioSpecificAttributes: mockAttributes
      }],
      userQualitativeGoals: mockGoals,
      updateScenarioAttribute: vi.fn(),
      deleteScenarioAttribute: vi.fn()
    });
  });

  it('renders the container with add button and fit score display', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    expect(screen.getByText('Qualitative Attributes')).toBeInTheDocument();
    expect(screen.getByText('Add Attribute')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 1')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 2')).toBeInTheDocument();
    expect(screen.getByText('Qualitative Fit Score')).toBeInTheDocument();
  });

  it('opens dialog when clicking Add Attribute button', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    const addButton = screen.getByText('Add Attribute');
    fireEvent.click(addButton);

    // Check that dialog opens (you may need to adjust this based on actual dialog implementation)
    expect(screen.getByText('Add Qualitative Attribute')).toBeInTheDocument();
  });

  it('disables add button when disabled prop is true', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
        disabled
      />
    );

    const addButton = screen.getByText('Add Attribute');
    expect(addButton).toBeDisabled();
  });

  it('renders attributes grid', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    // Both attributes should be rendered once
    expect(screen.getByText('Test attribute 1')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 2')).toBeInTheDocument();
  });

  it('handles empty scenarios gracefully', () => {
    (useUserAppState as any).mockReturnValue({
      scenarios: [],
      userQualitativeGoals: mockGoals,
      updateScenarioAttribute: vi.fn(),
      deleteScenarioAttribute: vi.fn()
    });

    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    // Should still render the container structure
    expect(screen.getByText('Qualitative Attributes')).toBeInTheDocument();
    expect(screen.getByText('Add Attribute')).toBeInTheDocument();
  });
}); 