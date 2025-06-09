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

  const defaultProps = {
    attribute: mockAttribute,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onUpdateName: vi.fn(),
    onUpdateSentiment: vi.fn(),
    onUpdateSignificance: vi.fn(),
    onMapToGoal: vi.fn(),
    getGoalNameById: mockGetGoalNameById,
    disabled: false
  };

  it('displays the goal name when attribute is mapped to a goal', () => {
    render(<QualitativeAttributeCard {...defaultProps} />);
    
    expect(screen.getByText('Goal: Financial Independence')).toBeInTheDocument();
  });

  it('displays fallback text when goal is not found', () => {
    const propsWithUnknownGoal = {
      ...defaultProps,
      attribute: {
        ...mockAttribute,
        mappedGoalId: 'unknown-goal-id'
      }
    };

    render(<QualitativeAttributeCard {...propsWithUnknownGoal} />);
    
    expect(screen.getByText('Mapped to Goal')).toBeInTheDocument();
  });

  it('displays red alert message when attribute is not mapped to any goal', () => {
    const propsWithoutMapping = {
      ...defaultProps,
      attribute: {
        ...mockAttribute,
        mappedGoalId: undefined
      }
    };

    render(<QualitativeAttributeCard {...propsWithoutMapping} />);
    
    expect(screen.getByText('No goal mapped')).toBeInTheDocument();
    expect(screen.getByText('No goal mapped')).toHaveClass('text-destructive');
  });

  it('calls onMapToGoal when clicking on goal badge', () => {
    const mockOnMapToGoal = vi.fn();
    const propsWithMockMapToGoal = {
      ...defaultProps,
      onMapToGoal: mockOnMapToGoal
    };

    render(<QualitativeAttributeCard {...propsWithMockMapToGoal} />);
    
    const goalBadge = screen.getByText('Goal: Financial Independence');
    fireEvent.click(goalBadge);
    
    expect(mockOnMapToGoal).toHaveBeenCalledWith(mockAttribute);
  });

  it('calls onMapToGoal when clicking on "No goal mapped" badge', () => {
    const mockOnMapToGoal = vi.fn();
    const unmappedAttribute = {
      ...mockAttribute,
      mappedGoalId: undefined
    };
    const propsWithoutMapping = {
      ...defaultProps,
      attribute: unmappedAttribute,
      onMapToGoal: mockOnMapToGoal
    };

    render(<QualitativeAttributeCard {...propsWithoutMapping} />);
    
    const noGoalBadge = screen.getByText('No goal mapped');
    fireEvent.click(noGoalBadge);
    
    expect(mockOnMapToGoal).toHaveBeenCalledWith(unmappedAttribute);
  });
}); 