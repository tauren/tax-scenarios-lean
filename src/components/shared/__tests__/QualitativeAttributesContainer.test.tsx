import { render, screen, fireEvent } from '@testing-library/react';
import { QualitativeAttributesContainer } from '../QualitativeAttributesContainer';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';
import { useUserAppState } from '@/store/userAppStateSlice';
import { qualitativeAttributeService } from '@/services/qualitativeAttributeService';

// Mock the useUserAppState hook
vi.mock('@/store/userAppStateSlice', () => ({
  useUserAppState: vi.fn()
}));

// Mock the qualitativeAttributeService
vi.mock('@/services/qualitativeAttributeService', () => ({
  qualitativeAttributeService: {
    calculateQualitativeFitScore: vi.fn()
  }
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

  const mockFitScore = {
    score: 75,
    goalAlignments: [
      {
        goalId: 'goal-1',
        goalName: 'Test Goal 1',
        isAligned: true,
        alignmentScore: 80,
        contributingAttributes: []
      },
      {
        goalId: 'goal-2',
        goalName: 'Test Goal 2',
        isAligned: false,
        alignmentScore: 40,
        contributingAttributes: []
      }
    ]
  };

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

    (qualitativeAttributeService.calculateQualitativeFitScore as any).mockReturnValue(mockFitScore);
  });

  it('renders the container with add button and fit score display', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    expect(screen.getByText('Location Considerations')).toBeInTheDocument();
    expect(screen.getByText('Add Consideration')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 1')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 2')).toBeInTheDocument();
    expect(screen.getByText('Qualitative Fit Score')).toBeInTheDocument();
  });

  it('opens dialog when clicking Add Consideration button', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    const addButton = screen.getByText('Add Consideration');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Consideration')).toBeInTheDocument();
  });

  it('disables add button when disabled prop is true', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
        disabled
      />
    );

    const addButton = screen.getByText('Add Consideration');
    expect(addButton).toBeDisabled();
  });

  it('renders attributes grid with pros and cons sections', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    // Both attributes should be rendered
    expect(screen.getByText('Test attribute 1')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 2')).toBeInTheDocument();

    // Pros section should be visible for positive sentiment
    expect(screen.getByText('Pros')).toBeInTheDocument();
  });

  it('handles empty scenarios gracefully', () => {
    (useUserAppState as any).mockReturnValue({
      scenarios: [],
      userQualitativeGoals: mockGoals,
      updateScenarioAttribute: vi.fn(),
      deleteScenarioAttribute: vi.fn()
    });

    (qualitativeAttributeService.calculateQualitativeFitScore as any).mockReturnValue({ score: 0, goalAlignments: [] });

    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    // Should still render the container structure
    expect(screen.getByText('Location Considerations')).toBeInTheDocument();
    expect(screen.getByText('Add Consideration')).toBeInTheDocument();
  });

  it('displays quick add button when onQuickAdd prop is provided', () => {
    const onQuickAdd = vi.fn();
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
        onQuickAdd={onQuickAdd}
      />
    );

    const quickAddButton = screen.getByText('Quick Add');
    expect(quickAddButton).toBeInTheDocument();
    
    fireEvent.click(quickAddButton);
    expect(onQuickAdd).toHaveBeenCalled();
  });

  it('calculates and displays fit score using the service', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    expect(qualitativeAttributeService.calculateQualitativeFitScore).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockScenarioId }),
      mockGoals
    );
    expect(screen.getByText('75%')).toBeInTheDocument(); // Score from mockFitScore with % symbol
  });
}); 