import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QualitativeAttributeCard } from '../QualitativeAttributeCard';
import type { ScenarioQualitativeAttribute } from '@/types';

describe('QualitativeAttributeCard', () => {
  const mockAttribute: ScenarioQualitativeAttribute = {
    id: 'attr-1',
    scenarioId: 'scenario-1',
    text: 'Test attribute',
    sentiment: 'Positive',
    significance: 'High',
    mappedGoalId: 'goal-1'
  };

  const mockGetGoalNameById = (goalId: string) => {
    if (goalId === 'goal-1') return 'Financial Independence';
    return undefined;
  };

  const mockGoalAlignments = [
    {
      goalId: 'goal-1',
      goalName: 'Financial Independence',
      alignmentScore: 50,
      isAligned: true,
      contributingAttributes: [
        { attributeId: 'attr-1', contribution: 0.5 }
      ]
    }
  ];

  const defaultProps = {
    attribute: mockAttribute,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onUpdateName: vi.fn(),
    onUpdateSentiment: vi.fn(),
    onUpdateSignificance: vi.fn(),
    onMapToGoal: vi.fn(),
    getGoalNameById: mockGetGoalNameById,
    goalAlignments: mockGoalAlignments,
    disabled: false
  };

  it('displays the goal name when attribute is mapped to a goal', () => {
    render(<QualitativeAttributeCard {...defaultProps} />);
    const goalFlag = screen.getByTestId('goal-flag');
    expect(goalFlag).toHaveTextContent('Goal: Financial Independence');
  });

  it('displays fallback text when goal is not found', () => {
    const propsWithUnknownGoal = {
      ...defaultProps,
      attribute: {
        ...mockAttribute,
        mappedGoalId: 'unknown-goal-id'
      },
      goalAlignments: [
        {
          goalId: 'unknown-goal-id',
          goalName: 'Unknown Goal',
          alignmentScore: 0,
          isAligned: false,
          contributingAttributes: [
            { attributeId: 'attr-1', contribution: 0 }
          ]
        }
      ]
    };

    render(<QualitativeAttributeCard {...propsWithUnknownGoal} />);
    const goalFlag = screen.getByTestId('goal-flag');
    expect(goalFlag).toHaveTextContent('Mapped to Goal');
  });

  it('displays red alert message when attribute is not mapped to any goal', () => {
    const propsWithoutMapping = {
      ...defaultProps,
      attribute: {
        ...mockAttribute,
        mappedGoalId: undefined
      },
      goalAlignments: []
    };

    render(<QualitativeAttributeCard {...propsWithoutMapping} />);
    const goalFlag = screen.getByTestId('goal-flag');
    expect(goalFlag).toHaveTextContent('Map a goal now');
    expect(goalFlag).toHaveClass('bg-red-700');
  });

  it('calls onMapToGoal when clicking on goal flag', () => {
    const mockOnMapToGoal = vi.fn();
    const propsWithMockMapToGoal = {
      ...defaultProps,
      onMapToGoal: mockOnMapToGoal
    };

    render(<QualitativeAttributeCard {...propsWithMockMapToGoal} />);
    const goalFlag = screen.getByTestId('goal-flag');
    fireEvent.click(goalFlag);
    expect(mockOnMapToGoal).toHaveBeenCalledWith(mockAttribute);
  });

  it('calls onMapToGoal when clicking on unmapped goal flag', () => {
    const mockOnMapToGoal = vi.fn();
    const unmappedAttribute = {
      ...mockAttribute,
      mappedGoalId: undefined
    };
    const propsWithoutMapping = {
      ...defaultProps,
      attribute: unmappedAttribute,
      onMapToGoal: mockOnMapToGoal,
      goalAlignments: []
    };

    render(<QualitativeAttributeCard {...propsWithoutMapping} />);
    const goalFlag = screen.getByTestId('goal-flag');
    fireEvent.click(goalFlag);
    expect(mockOnMapToGoal).toHaveBeenCalledWith(unmappedAttribute);
  });
}); 