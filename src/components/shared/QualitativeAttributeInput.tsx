import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import * as Label from '@radix-ui/react-label';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import { WeightSelector } from './WeightSelector';
import { SentimentSelector } from './SentimentSelector';

interface QualitativeAttributeInputProps {
  onAdd: (attribute: Omit<ScenarioQualitativeAttribute, 'id' | 'scenarioId'>) => void;
  disabled?: boolean;
}

export const QualitativeAttributeInput: React.FC<QualitativeAttributeInputProps> = ({
  onAdd,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<ScenarioQualitativeAttribute['sentiment']>('neutral');
  const [significance, setSignificance] = useState<ScenarioQualitativeAttribute['significance']>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd({
      text: text.trim(),
      sentiment,
      significance,
    });

    // Reset form
    setText('');
    setSentiment('neutral');
    setSignificance('Medium');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label.Root htmlFor="thoughts" className="text-sm font-medium">
          Jot down your thoughts
        </Label.Root>
        <textarea
          id="thoughts"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          disabled={disabled}
          className="w-full min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="sentiment" className="text-sm font-medium">
          How do you feel about this?
        </Label.Root>
        <SentimentSelector
          value={sentiment}
          onChange={setSentiment}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="significance" className="text-sm font-medium">
          How significant is this to you?
        </Label.Root>
        <WeightSelector
          value={significance}
          onChange={setSignificance}
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
      >
        Add Attribute
      </button>
    </form>
  );
}; 