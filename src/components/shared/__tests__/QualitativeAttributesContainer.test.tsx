import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QualitativeAttributesContainer } from '../QualitativeAttributesContainer';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';
import { useUserAppState } from '@/store/userAppStateSlice';

// Mock the useUserAppState hook
vi.mock('@/store/userAppStateSlice', () => ({
  useUserAppState: vi.fn()
}));

describe.skip('QualitativeAttributesContainer', () => {
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
      scenarioId: mockScenarioId,
      text: 'Test attribute 1',
      sentiment: 'Positive',
      significance: 'High',
      mappedGoalId: 'goal-1'
    },
    {
      id: 'attr-2',
      scenarioId: mockScenarioId,
      text: 'Test attribute 2',
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

  it('renders the input form, list, and fit score display', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    expect(screen.getByLabelText(/jot down your thoughts/i)).toBeInTheDocument();
    expect(screen.getByText('Test attribute 1')).toBeInTheDocument();
    expect(screen.getByText('Test attribute 2')).toBeInTheDocument();
    expect(screen.getByText(/qualitative fit score/i)).toBeInTheDocument();
  });

  it('allows adding a new attribute', async () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    const input = screen.getByLabelText(/jot down your thoughts/i);
    const addButton = screen.getByText(/add attribute/i);

    fireEvent.change(input, { target: { value: 'New test attribute' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New test attribute')).toBeInTheDocument();
    });
  });

  it('allows deleting an attribute', async () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    const deleteButtons = screen.getAllByTitle(/delete attribute/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Test attribute 1')).not.toBeInTheDocument();
    });
  });

  it('opens the mapping dialog when clicking the map button', async () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    const mapButtons = screen.getAllByTitle(/map to a goal/i);
    fireEvent.click(mapButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/map attribute to goal/i)).toBeInTheDocument();
      expect(screen.getByText('Test attribute 1')).toBeInTheDocument();
    });
  });

  it('disables all interactions when disabled prop is true', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
        disabled
      />
    );

    expect(screen.getByLabelText(/jot down your thoughts/i)).toBeDisabled();
    expect(screen.getByText(/add attribute/i)).toBeDisabled();

    const deleteButtons = screen.getAllByTitle(/delete attribute/i);
    const mapButtons = screen.getAllByTitle(/map to a goal/i);

    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    mapButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('calculates and displays the fit score correctly', () => {
    render(
      <QualitativeAttributesContainer
        scenarioId={mockScenarioId}
      />
    );

    // The score should be 100 because we have one positive attribute with High significance
    // mapped to a High priority goal
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
}); 